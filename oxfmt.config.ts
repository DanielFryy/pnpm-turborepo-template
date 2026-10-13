import { defineConfig } from "oxfmt";

const config = defineConfig({
  arrowParens: "avoid",
  bracketSpacing: true,
  printWidth: 120,
  proseWrap: "preserve",
  quoteProps: "as-needed",
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "none",
  useTabs: false,
  sortPackageJson: false,
  ignorePatterns: [".agents"]
});

export default config;
