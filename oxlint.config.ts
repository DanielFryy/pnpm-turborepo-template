import { defineConfig } from "oxlint";

import base from "./packages/oxlint-config/base.ts";

export default defineConfig({
  extends: [base],
  plugins: [],
  options: { reportUnusedDisableDirectives: "warn" }
});
