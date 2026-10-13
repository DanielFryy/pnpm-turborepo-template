# Shared Oxlint configuration

This package exports TypeScript configurations for Oxlint. Oxfmt handles formatting through the root `oxfmt.config.ts`.

## Configuration

- `base.ts` defines common JavaScript and TypeScript rules.
- `next.ts` adds Next.js, accessibility, React Hooks, and import ordering rules.
- `react-internal.ts` adds React component and React Compiler checks for the UI package, with stricter TypeScript restrictions than the apps.

The root `oxlint.config.ts` extends the base configuration for tooling files. Each app and the UI package has an `oxlint.config.ts` that imports its shared configuration:

```ts
import config from "@repo/oxlint-config/next";
import { defineConfig } from "oxlint";

const projectConfig = defineConfig({ extends: [config], plugins: [] });
export default projectConfig;
```

Use Node.js 22.18+ on the 22.x release line, or Node.js 24+. See the [Oxlint configuration documentation](https://oxc.rs/docs/guide/usage/linter/config.html) for TypeScript configuration support.

Oxlint selects the nearest configuration for each file. Parent and child configurations do not merge automatically, so every workspace explicitly extends its preset. `plugins: []` inherits the preset's plugins without adding Oxlint's defaults. See [nested configurations](https://oxc.rs/docs/guide/usage/linter/nested-config.html).

Workspace configurations supply their environments, globals, and plugin settings. The apps resolve their Next.js roots and TypeScript configuration paths relative to their own configuration files. Shared configurations resolve JavaScript plugins from this package so consumers do not need to declare those dependencies.

Rules report warnings, and lint commands use `--max-warnings 0` so violations fail. Rules are enabled explicitly. TypeScript overrides leave checks such as undefined variables to `tsc`.

`pnpm lint` runs Oxlint once from the repository root and discovers nested configurations automatically. Do not add `--config` to this command: it disables nested discovery. The root configuration enables unused-disable warnings for the whole run.

Oxlint reads `.gitignore`; workspace configurations also ignore `dist/**`. Turbo registers linting and formatting as root tasks, with repository files included in the default cache inputs. Workspace lint scripts are unnecessary. These tasks always check the whole repository.

`pnpm exec turbo run quality` runs linting and formatting checks in parallel. `pnpm exec turbo run quality:fix` applies lint fixes before formatting to prevent concurrent writes. Both fix tasks disable caching. The current lint rules do not require type-aware linting or dependency builds.

## JavaScript plugins

Oxlint runs these checks through its [JavaScript plugin support](https://oxc.rs/docs/guide/usage/linter/js-plugins):

| Plugin                     | Checks                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| `eslint-plugin-turbo`      | Environment variables declared in Turbo configuration.                                     |
| `eslint-plugin-import`     | Import groups, case-sensitive ordering, blank lines, asset groups, and TypeScript aliases. |
| `@next/eslint-plugin-next` | Relative destinations passed to `location.assign`.                                         |

`plugins.ts` exports the selected rules under the `workspace` namespace. It imports the ordering rule directly to avoid loading an additional lint engine. The pnpm override excludes that engine from plugin peer dependencies.

## React checks

React component, Hooks, and Compiler checks use Oxlint's native `react` plugin. The UI configuration enables the supported recommended Compiler rules, including immutability, purity, refs, and state updates.

Oxlint uses fixed compiler options and does not expose gating options, so no JavaScript compiler-configuration rules are needed. See [React Compiler support](https://oxc.rs/blog/2026-08-18-react-compiler-support).

TypeScript checks component prop types. The lint configuration does not enforce runtime `propTypes` declarations or a general React API deprecation check.

The UI rejects unused underscore-prefixed arguments. Both configurations reject values used only in type queries. The apps allow unused arguments, caught errors, underscore-prefixed destructured array items, and rest siblings.

## Formatting

Oxfmt uses a 120-character line width, double quotes, semicolons, two-space indentation, and no trailing commas. Package fields, imports, and Tailwind classes are not sorted by the formatter. Oxlint handles import ordering.

`pnpm format` and `pnpm check-format` cover JavaScript, TypeScript, TSX, JSON, CSS, and Markdown. The `.agents` directory is excluded.

## Verification

`pnpm test:lint-config` checks lint diagnostics, nested configuration discovery, ignored files in all three workspaces, formatting output, and tooling dependencies. It also runs with `pnpm test`.

The TypeScript test suite covers unused-variable options, type-only usage, TypeScript restrictions, Hooks, accessibility, import ordering, React checks, environment access, and parsing. Rule fixtures use the system temporary directory. The nested-discovery check creates temporary TypeScript files inside each workspace to exercise the real configuration hierarchy. All fixtures are removed after their checks. Turbo caching is disabled for this suite because it exercises other workspaces' configurations.
