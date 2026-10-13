import config from "@repo/oxlint-config/react-internal";
import { defineConfig } from "oxlint";

const oxConfig = defineConfig({
  extends: [config],
  plugins: [],
  ignorePatterns: ["dist/**"],
  env: { builtin: true, browser: true, serviceworker: true }
});

export default oxConfig;
