import { fileURLToPath } from "node:url";
import { defineConfig } from "oxlint";

import base from "@repo/oxlint-config/base";

export default defineConfig({
  extends: [base],
  plugins: ["typescript", "import", "react", "nextjs", "jsx-a11y"],
  jsPlugins: [{ name: "workspace", specifier: fileURLToPath(new URL("./plugins.ts", import.meta.url)) }],
  rules: {
    "no-unused-vars": [
      "warn",
      {
        vars: "all",
        args: "none",
        ignoreRestSiblings: true,
        caughtErrors: "none",
        destructuredArrayIgnorePattern: "^_",
        argsIgnorePattern: "^_",
        reportVarsOnlyUsedAsTypes: true
      }
    ],
    "jsx-a11y/alt-text": "warn",
    "jsx-a11y/anchor-has-content": "warn",
    "jsx-a11y/anchor-is-valid": "warn",
    "jsx-a11y/aria-activedescendant-has-tabindex": "warn",
    "jsx-a11y/aria-props": "warn",
    "jsx-a11y/aria-proptypes": "warn",
    "jsx-a11y/aria-role": "warn",
    "jsx-a11y/aria-unsupported-elements": "warn",
    "jsx-a11y/autocomplete-valid": "warn",
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/heading-has-content": "warn",
    "jsx-a11y/html-has-lang": "warn",
    "jsx-a11y/iframe-has-title": "warn",
    "jsx-a11y/img-redundant-alt": "warn",
    "jsx-a11y/interactive-supports-focus": [
      "warn",
      { tabbable: ["button", "checkbox", "link", "searchbox", "spinbutton", "switch", "textbox"] }
    ],
    "jsx-a11y/label-has-associated-control": "warn",
    "jsx-a11y/media-has-caption": "warn",
    "jsx-a11y/mouse-events-have-key-events": "warn",
    "jsx-a11y/no-access-key": "warn",
    "jsx-a11y/no-autofocus": "warn",
    "jsx-a11y/no-distracting-elements": "warn",
    "jsx-a11y/no-interactive-element-to-noninteractive-role": [
      "warn",
      { tr: ["none", "presentation"], canvas: ["img"] }
    ],
    "jsx-a11y/no-noninteractive-element-interactions": [
      "warn",
      {
        handlers: ["onClick", "onError", "onLoad", "onMouseDown", "onMouseUp", "onKeyPress", "onKeyDown", "onKeyUp"],
        alert: ["onKeyUp", "onKeyDown", "onKeyPress"],
        body: ["onError", "onLoad"],
        dialog: ["onKeyUp", "onKeyDown", "onKeyPress"],
        iframe: ["onError", "onLoad"],
        img: ["onError", "onLoad"]
      }
    ],
    "jsx-a11y/no-noninteractive-element-to-interactive-role": [
      "warn",
      {
        ul: ["listbox", "menu", "menubar", "radiogroup", "tablist", "tree", "treegrid"],
        ol: ["listbox", "menu", "menubar", "radiogroup", "tablist", "tree", "treegrid"],
        li: ["menuitem", "menuitemradio", "menuitemcheckbox", "option", "row", "tab", "treeitem"],
        table: ["grid"],
        td: ["gridcell"],
        fieldset: ["radiogroup", "presentation"]
      }
    ],
    "jsx-a11y/no-noninteractive-tabindex": ["warn", { tags: [], roles: ["tabpanel"], allowExpressionValues: true }],
    "jsx-a11y/no-redundant-roles": "warn",
    "jsx-a11y/no-static-element-interactions": [
      "warn",
      {
        allowExpressionValues: true,
        handlers: ["onClick", "onMouseDown", "onMouseUp", "onKeyPress", "onKeyDown", "onKeyUp"]
      }
    ],
    "jsx-a11y/role-has-required-aria-props": "warn",
    "jsx-a11y/role-supports-aria-props": "warn",
    "jsx-a11y/scope": "warn",
    "jsx-a11y/tabindex-no-positive": "warn",
    "nextjs/google-font-display": "warn",
    "nextjs/google-font-preconnect": "warn",
    "nextjs/next-script-for-ga": "warn",
    "nextjs/no-async-client-component": "warn",
    "nextjs/no-before-interactive-script-outside-document": "warn",
    "nextjs/no-css-tags": "warn",
    "nextjs/no-head-element": "warn",
    "nextjs/no-html-link-for-pages": "warn",
    "nextjs/no-img-element": "warn",
    "nextjs/no-page-custom-font": "warn",
    "nextjs/no-styled-jsx-in-document": "warn",
    "nextjs/no-sync-scripts": "warn",
    "nextjs/no-title-in-document-head": "warn",
    "nextjs/no-typos": "warn",
    "nextjs/no-unwanted-polyfillio": "warn",
    "nextjs/inline-script-id": "warn",
    "nextjs/no-assign-module-variable": "warn",
    "nextjs/no-document-import-in-page": "warn",
    "nextjs/no-duplicate-head": "warn",
    "nextjs/no-head-import-in-document": "warn",
    "nextjs/no-script-component-in-head": "warn",
    "react/rules-of-hooks": "warn",
    "workspace/import-order": [
      "warn",
      {
        groups: [["builtin", "external"], ["internal", "parent", "sibling", "index"], ["object"]],
        pathGroups: [
          { pattern: "*.svg", patternOptions: { matchBase: true }, group: "object" },
          { pattern: "*.svg?inline", patternOptions: { matchBase: true }, group: "object" },
          { pattern: "*.svg?url", patternOptions: { matchBase: true }, group: "object" },
          { pattern: "*.png", patternOptions: { matchBase: true }, group: "object" },
          { pattern: "*.jpg", patternOptions: { matchBase: true }, group: "object" },
          { pattern: "*.jpeg", patternOptions: { matchBase: true }, group: "object" },
          { pattern: "*.gif", patternOptions: { matchBase: true }, group: "object" },
          { pattern: "*.webp", patternOptions: { matchBase: true }, group: "object" },
          { pattern: "*.avif", patternOptions: { matchBase: true }, group: "object" },
          { pattern: "*.json", patternOptions: { matchBase: true }, group: "object" },
          { pattern: "*.md", patternOptions: { matchBase: true }, group: "object" },
          { pattern: "*.txt", patternOptions: { matchBase: true }, group: "object" },
          { pattern: "*.tif", patternOptions: { matchBase: true }, group: "object" },
          { pattern: "*.tiff", patternOptions: { matchBase: true }, group: "object" },
          { pattern: "*.woff", patternOptions: { matchBase: true }, group: "object" },
          { pattern: "*.woff2", patternOptions: { matchBase: true }, group: "object" }
        ],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: false, orderImportKind: "ignore" },
        distinctGroup: true,
        sortTypesGroup: false,
        named: false,
        warnOnUnassignedImports: false
      }
    ],
    "workspace/no-location-assign-relative-destination": "warn"
  }
});
