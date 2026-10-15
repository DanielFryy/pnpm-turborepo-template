import config from "@repo/oxlint-config/react-internal";
import { defineConfig } from "oxlint";

const oxConfig = defineConfig({
  extends: [config],
  plugins: [],
  ignorePatterns: ["dist/**"],
  env: { builtin: true, browser: true, serviceworker: true },
  overrides: [
    {
      files: ["src/components/**"],
      rules: {
        "shadcn/no-restyle": "off",
        "shadcn/no-arbitrary-values": "off",
        "shadcn/require-static-classes": "off"
      }
    }
  ]
});

export default oxConfig;
