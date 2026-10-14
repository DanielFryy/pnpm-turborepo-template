import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import fixtures from "./fixtures.json" with { type: "json" };

const repository = fileURLToPath(new URL("../../../", import.meta.url));
const cli = path.join(repository, "node_modules/oxlint/bin/oxlint");

const normalizeRule = (rule: string) => {
  return rule
    .replace(/^([^()]+)\(([^()]+)\)$/, "$1/$2")
    .replace(/^eslint\//, "")
    .replace(/^react-hooks\//, "react/")
    .replace(/^next\//, "nextjs/")
    .replace(/^workspace\/import-order$/, "import/order")
    .replace(/^workspace\/no-location-assign-relative-destination$/, "nextjs/no-location-assign-relative-destination")
    .replace(/^typescript\/(no-unused-vars|no-unused-expressions|no-array-constructor)$/, "$1");
};

for (const fixture of fixtures) {
  const { scope, name, code, extension, expected } = fixture;
  test(`${scope}: ${name}`, () => {
    const cwd = path.join(repository, scope === "next" ? "apps/web" : "packages/ui");
    const directory = mkdtempSync(path.join(tmpdir(), "lint-config-fixture-"));
    const filename = path.join(directory, `fixture.${extension}`);
    try {
      copyFileSync(path.join(cwd, "package.json"), path.join(directory, "package.json"));
      writeFileSync(filename, code);
      const configPath = path.join(cwd, "oxlint.config.ts");
      const args = [cli, filename, "--config", configPath, "--format", "json", "--max-warnings", "0"];
      const result = spawnSync(process.execPath, args, { cwd, encoding: "utf8" });
      const { error, stdout, stderr, status } = result;
      assert.ifError(error);
      assert.equal(stderr, "");
      const { diagnostics }: { diagnostics: { code?: string }[] } = JSON.parse(stdout);
      const actual = [...new Set(diagnostics.map(diagnostic => normalizeRule(diagnostic.code || "parse")))].sort();
      assert.deepEqual(actual, expected);
      assert.equal(status, expected.length > 0 ? 1 : 0);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
}

for (const workspace of ["apps/web", "apps/docs", "packages/ui"]) {
  test(`${workspace}: generated files stay ignored`, () => {
    const cwd = path.join(repository, workspace);
    const result = spawnSync(process.execPath, [cli, ".", "--debug", "files"], { cwd, encoding: "utf8" });
    const { status, stdout } = result;
    assert.equal(status, 0);
    assert.doesNotMatch(stdout, /\/(?:node_modules|\.next|coverage|dist|\.turbo)\//);
  });
}

test("root lint discovers workspace rules and reports unused disable directives", () => {
  const workspaces = ["apps/web", "apps/docs", "packages/ui"];
  const directories: string[] = [];
  try {
    const filenames = workspaces.map(workspace => {
      const directory = mkdtempSync(path.join(repository, workspace, "lint-config-fixture-"));
      directories.push(directory);
      const filename = path.join(directory, "fixture.ts");
      writeFileSync(filename, "// oxlint-disable-next-line no-debugger\nexport const value: any = 1;\n");

      return filename;
    });
    const result = spawnSync(process.execPath, [cli, ...filenames, "--format", "json", "--max-warnings", "0"], {
      cwd: repository,
      encoding: "utf8"
    });
    const { error, status, stdout, stderr } = result;
    assert.ifError(error);
    assert.equal(stderr, "");
    assert.equal(status, 1);
    const { diagnostics }: { diagnostics: { code?: string; filename: string; message: string }[] } = JSON.parse(stdout);
    for (const [index, filename] of filenames.entries()) {
      const actual = diagnostics.filter(diagnostic => path.resolve(repository, diagnostic.filename) === filename);
      const ruleDiagnostics = actual.filter(diagnostic => diagnostic.code);
      assert.deepEqual(
        ruleDiagnostics.map(diagnostic => normalizeRule(diagnostic.code!)),
        workspaces[index] === "packages/ui" ? ["typescript/no-explicit-any"] : []
      );
      assert.ok(actual.some(diagnostic => /unused.*directive/i.test(diagnostic.message)));
    }
  } finally {
    for (const directory of directories) rmSync(directory, { recursive: true, force: true });
  }
});

test("official CLI fixes braces and type imports without a custom fixer", () => {
  const directory = mkdtempSync(path.join(tmpdir(), "native-fix-fixture-"));
  const filename = path.join(directory, "fixture.ts");
  const config = path.join(repository, "packages/oxlint-config/base.ts");
  const code =
    'import { ReactNode } from "react";\nexport type Value = ReactNode;\nexport function run(ready: boolean) { if (ready)\n console.log(ready); }\n';
  try {
    writeFileSync(filename, code);
    const args = [cli, filename, "--config", config, "--fix", "--max-warnings", "0"];
    const first = spawnSync(process.execPath, args, { cwd: repository, encoding: "utf8" });
    assert.equal(first.status, 0, first.stdout + first.stderr);
    const fixed = readFileSync(filename, "utf8");
    assert.match(fixed, /import type \{ ReactNode \}/);
    assert.match(fixed, /if \(ready\)\s*\{/);
    const second = spawnSync(process.execPath, args, { cwd: repository, encoding: "utf8" });
    assert.equal(second.status, 0, second.stdout + second.stderr);
    assert.equal(readFileSync(filename, "utf8"), fixed);
    const component = path.join(directory, "Card.tsx");
    const componentCode = "export function Card() { return <div />; }";
    writeFileSync(component, componentCode);
    const componentResult = spawnSync(
      process.execPath,
      [
        cli,
        component,
        "--config",
        path.join(repository, "packages/ui/oxlint.config.ts"),
        "--fix",
        "--max-warnings",
        "0"
      ],
      { cwd: repository, encoding: "utf8" }
    );
    assert.equal(componentResult.status, 1, componentResult.stdout + componentResult.stderr);
    assert.match(componentResult.stdout, /function-component-definition/);
    assert.equal(readFileSync(component, "utf8"), componentCode);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("native component and page limits follow nested workspace configuration", () => {
  const directories: string[] = [];
  try {
    for (const workspace of ["apps/web", "apps/docs", "packages/ui"]) {
      const directory = mkdtempSync(path.join(repository, workspace, "native-rules-fixture-"));
      const entries = [
        { filename: "Card.tsx", lines: 150, expected: ["max-lines"] },
        { filename: "Card.test.tsx", lines: 150, expected: [] },
        { filename: "app/page.tsx", lines: 101, expected: workspace === "packages/ui" ? [] : ["max-lines"] },
        { filename: "src/app/page.tsx", lines: 101, expected: workspace === "packages/ui" ? [] : ["max-lines"] },
        {
          filename: "Component.tsx",
          code: "export function Card() { return <div />; }",
          expected: ["react/function-component-definition"]
        },
        { filename: "config.ts", code: "export default {};", expected: ["import/no-anonymous-default-export"] }
      ];
      directories.push(directory);
      for (const entry of entries) {
        const { filename: relative, lines, code, expected } = entry;
        const filename = path.join(directory, relative);
        const input =
          code ?? Array.from({ length: lines! }, (_, index) => `export const value${index} = ${index};`).join("\n");
        mkdirSync(path.dirname(filename), { recursive: true });
        writeFileSync(filename, input);
        const result = spawnSync(process.execPath, [cli, filename, "--format", "json", "--max-warnings", "0"], {
          cwd: repository,
          encoding: "utf8"
        });
        assert.ifError(result.error);
        const { diagnostics }: { diagnostics: { code: string }[] } = JSON.parse(result.stdout);
        const actual = [...new Set(diagnostics.map(diagnostic => normalizeRule(diagnostic.code)))].sort();
        assert.deepEqual(actual, expected, `${workspace}/${relative}`);
        assert.equal(result.status, expected.length ? 1 : 0, result.stdout + result.stderr);
      }
    }
  } finally {
    for (const directory of directories) rmSync(directory, { recursive: true, force: true });
  }
});
