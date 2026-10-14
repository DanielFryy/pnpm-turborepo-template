import config from "@repo/oxlint-config/next";
import { fileURLToPath } from "node:url";
import { defineConfig } from "oxlint";

const projectConfig = defineConfig({
  extends: [config],
  plugins: [],
  ignorePatterns: ["dist/**"],
  env: { builtin: true, es2020: true },
  settings: {
    next: { rootDir: fileURLToPath(new URL(".", import.meta.url)) },
    "import/resolver": { typescript: { project: [fileURLToPath(new URL("./tsconfig.json", import.meta.url))] } },
    "import/ignore": ["vscode"],
    "import/core-modules": ["vscode"]
  },
  globals: { process: "readonly" }
});

export default projectConfig;
