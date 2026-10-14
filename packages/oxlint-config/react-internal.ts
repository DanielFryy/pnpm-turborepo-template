import { defineConfig } from "oxlint";

import base from "@repo/oxlint-config/base";

const config = defineConfig({
  extends: [base],
  plugins: ["typescript", "react"],
  rules: {
    "no-extra-boolean-cast": "warn",
    "no-unused-vars": [
      "warn",
      {
        vars: "all",
        args: "after-used",
        caughtErrors: "all",
        ignoreRestSiblings: false,
        reportVarsOnlyUsedAsTypes: true
      }
    ],
    "react/display-name": "warn",
    "react/jsx-key": "warn",
    "react/jsx-no-comment-textnodes": "warn",
    "react/jsx-no-duplicate-props": "warn",
    "react/jsx-no-target-blank": "warn",
    "react/jsx-no-undef": "warn",
    "react/no-children-prop": "warn",
    "react/no-danger-with-children": "warn",
    "react/no-direct-mutation-state": "warn",
    "react/no-find-dom-node": "warn",
    "react/no-is-mounted": "warn",
    "react/no-render-return-value": "warn",
    "react/no-string-refs": "warn",
    "react/no-unescaped-entities": "warn",
    "react/no-unknown-property": "warn",
    "react/require-render-return": "warn",
    "react/rules-of-hooks": "warn",
    "react/static-components": "warn",
    "react/use-memo": "warn",
    "react/preserve-manual-memoization": "warn",
    "react/incompatible-library": "warn",
    "react/immutability": "warn",
    "react/globals": "warn",
    "react/refs": "warn",
    "react/set-state-in-effect": "warn",
    "react/error-boundaries": "warn",
    "react/purity": "warn",
    "react/set-state-in-render": "warn",
    "react/unsupported-syntax": "warn",
    "typescript/ban-ts-comment": "warn",
    "typescript/no-empty-object-type": "warn",
    "typescript/no-explicit-any": "warn",
    "typescript/no-namespace": "warn"
  },
  overrides: [
    {
      files: ["**/*.jsx", "**/*.tsx"],
      rules: {
        "react/function-component-definition": [
          "warn",
          { namedComponents: "arrow-function", unnamedComponents: "arrow-function" }
        ],
        "react/no-multi-comp": ["warn", { ignoreStateless: false }],
        "max-lines": ["warn", { max: 149, skipBlankLines: true, skipComments: true }]
      }
    },
    {
      files: ["**/*.test.*", "**/*.spec.*", "**/*.stories.*", "**/*.hooks.*", "**/test/**"],
      rules: { "react/function-component-definition": "off", "react/no-multi-comp": "off", "max-lines": "off" }
    }
  ]
});

export default config;
