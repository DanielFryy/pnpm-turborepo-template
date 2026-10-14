import next from "@next/eslint-plugin-next";
import type importPlugin from "eslint-plugin-import";
import { createRequire } from "node:module";

const { rules: nextRules } = next;
const require = createRequire(import.meta.url);
const importOrder: (typeof importPlugin.rules)[string] = require("eslint-plugin-import/lib/rules/order.js");

// Load import/order directly: the full import plugin loads the ESLint engine.
const config = {
  meta: { name: "workspace" },
  rules: {
    "import-order": importOrder,
    "no-location-assign-relative-destination": nextRules["no-location-assign-relative-destination"]
  }
};

export default config;
