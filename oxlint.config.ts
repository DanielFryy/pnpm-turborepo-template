import { defineConfig } from "oxlint";

import base from "./packages/oxlint-config/base.ts";

const config = defineConfig({
  extends: [base],
  plugins: [],
  options: { reportUnusedDisableDirectives: "warn" }
});

export default config;
