import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repository = fileURLToPath(new URL("../../../", import.meta.url));
const cli = path.join(repository, "node_modules/oxfmt/bin/oxfmt");
const cases = [
  {
    name: "JavaScript style and unchanged import order",
    filename: "fixture.ts",
    input: "import z from 'z';\nimport a from 'a';\nexport const run = (value) => ({z,a,value,});\n",
    expected: 'import z from "z";\nimport a from "a";\nexport const run = value => ({ z, a, value });\n'
  },
  {
    name: "package fields retain their order",
    filename: "package.json",
    input: '{"z":true,"name":"fixture","a":1}',
    expected: '{\n  "z": true,\n  "name": "fixture",\n  "a": 1\n}\n'
  },
  {
    name: "lines between 100 and 120 characters stay together",
    filename: "fixture.ts",
    input: `export const value='${"a".repeat(90)}'`,
    expected: `export const value = "${"a".repeat(90)}";\n`
  },
  {
    name: "Markdown prose wrapping stays preserved",
    filename: "fixture.md",
    input: `${"A sentence with ordinary words. ".repeat(8).trim()}\n`,
    expected: `${"A sentence with ordinary words. ".repeat(8).trim()}\n`
  }
];

for (const entry of cases) {
  const { name, filename, input, expected } = entry;
  test(name, () => {
    const args = [cli, "--stdin-filepath", filename];
    const result = spawnSync(process.execPath, args, { cwd: repository, input, encoding: "utf8" });
    const { error, status, stdout, stderr } = result;
    assert.ifError(error);
    assert.equal(status, 0, stderr);
    assert.equal(stdout, expected);
  });
}

test("tooling dependencies exclude unused lint and format engines", () => {
  const lockfile = readFileSync(path.join(repository, "pnpm-lock.yaml"), "utf8");
  assert.doesNotMatch(lockfile, /^ {2}(?:eslint|prettier|eslint-plugin-react(?:-hooks)?)@/m);
});
