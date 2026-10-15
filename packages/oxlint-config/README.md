# Shared Oxlint configuration

This package exports TypeScript configurations for Oxlint. Oxfmt handles formatting through the root `oxfmt.config.ts`.

## Configuration

- `base.ts` defines common JavaScript and TypeScript rules.
- `next.ts` adds Next.js, accessibility, React Hooks, component conventions, and import ordering.
- `react-internal.ts` adds component and React Compiler checks for the UI package, with stricter TypeScript restrictions than the apps.

Use Node.js 22.18+ on the 22.x release line, or Node.js 24+, to load these configurations. Every workspace explicitly extends its preset; nearest configurations do not automatically inherit parent configurations. `plugins: []` inherits the preset's plugins without adding Oxlint's defaults. See the [configuration documentation](https://oxc.rs/docs/guide/usage/linter/config.html) and [nested configurations](https://oxc.rs/docs/guide/usage/linter/nested-config.html).

Existing rules report warnings, while the five core shadcn rules report errors. Lint commands use `--max-warnings 0` so both fail checks. Rules are enabled explicitly. TypeScript overrides leave checks such as undefined variables to `tsc`. Workspace configurations supply environments, globals, and plugin settings, resolving paths relative to their own configuration files.

`pnpm lint` discovers nested configurations from the root. Do not add `--config` to this command, because it disables nested discovery. The root configuration enables unused-disable warnings. Oxlint reads `.gitignore`; workspaces also ignore `dist/**`.

## Fixing and formatting

- `pnpm lint:fix` runs `oxlint . --fix --max-warnings 0` directly.
- `pnpm format` runs Oxfmt directly; `pnpm check-format` checks its output.
- `pnpm fix` and `pnpm exec turbo run quality:fix` run lint fixes, then formatting through Turbo task dependencies. They stop if unfixed lint violations remain. Fix tasks are uncached.
- `pnpm exec turbo run quality` checks lint and formatting in parallel and caches successful results.
- For a selected file, use `pnpm exec oxlint path/to/file.tsx --fix --max-warnings 0` and `pnpm exec oxfmt --write path/to/file.tsx`.

There is no custom fix runner, file traversal, TypeScript AST parser, or source rewriting plugin. Only Oxlint and Oxfmt perform fixes. Suggestions and dangerous fixes are not enabled. Run `pnpm exec turbo run quality` after fixing to catch any issues exposed by formatting. These root tasks operate on the whole repository; package filters do not narrow them to individual workspaces.

Oxfmt uses a 120-character width, double quotes, semicolons, two-space indentation, and no trailing commas. Format commands cover JavaScript, TypeScript, JSX, TSX, module variants, JSON, CSS, and Markdown; `.agents` is excluded. Oxfmt does not sort imports or Tailwind classes. Import ordering belongs to lint.

## Existing JavaScript plugins

These established third-party checks use Oxlint's [JavaScript plugin support](https://oxc.rs/docs/guide/usage/linter/js-plugins):

| Plugin                     | Checks                                                                  |
| -------------------------- | ----------------------------------------------------------------------- |
| `eslint-plugin-turbo`      | Environment variables declared in Turbo configuration.                  |
| `eslint-plugin-import`     | Import groups, ordering, asset groups, and TypeScript alias resolution. |
| `@next/eslint-plugin-next` | Relative destinations passed to `location.assign`.                      |

`plugins.ts` exposes selected existing rules under `workspace`. It imports the ordering rule directly to avoid loading another lint engine. The pnpm override excludes that engine from plugin peer dependencies. These adapters do not implement custom convention rules or manually rewrite files.

## shadcn lint

`@shadcn/lint` is installed in this package and registered through `jsPlugins` in `base.ts`. Both apps and the UI package inherit the registration. The five core rules from the [adoption guide](https://github.com/shadcn-ui/lint/blob/main/docs/adoption.md#add-more-rules) report errors: `no-restyle`, `no-raw-colors`, `no-arbitrary-values`, `no-inline-styles`, and `require-static-classes`. The `no-restyle` and `no-arbitrary-values` rules allow layout classes.

The existing `components.json` files in `apps/web`, `apps/docs`, and `packages/ui` identify `@repo/ui/components` and the shared Tailwind v4 theme at `packages/ui/src/styles/globals.css`. Their TypeScript aliases and package exports resolve shared components, so no extra discovery settings are needed.

The override in `packages/ui/oxlint.config.ts` matches `src/components/**`, relative to the UI package. It disables `no-restyle`, `no-arbitrary-values`, and `require-static-classes` where shared components define their appearance. `no-raw-colors` and `no-inline-styles` remain enabled there. App components and other UI-package files keep all five rules. `no-unknown-classes` remains a separate opt-in check.

Adjust rules in `base.ts` for the repository, `next.ts` for both apps, `react-internal.ts` for the UI package, or an individual workspace's `oxlint.config.ts` for local policies. See the [available rules](https://github.com/shadcn-ui/lint/blob/main/docs/rules.md), [configuration examples](https://github.com/shadcn-ui/lint/blob/main/README.md#settings), and [discovery documentation](https://github.com/shadcn-ui/lint/blob/main/docs/how-it-works.md).

Run `pnpm lint` or `pnpm exec turbo run quality` from the repository root. To check one workspace, run `pnpm exec oxlint apps/web --max-warnings 0`, replacing `apps/web` with `apps/docs` or `packages/ui` as needed.

## Skill coverage

Skill enforcement uses rules shipped in Oxlint 1.82.0 and covers only conventions those rules support. Some skill conventions remain unenforced or only partially covered.

The [Adding Linter Rules guide](https://oxc.rs/docs/contribute/linter/adding-rules.html) describes Rust contributions inside the Oxc repository. This project consumes the published binary; adding a Rust file here would not register a rule in that binary. No Oxc fork or replacement implementation is included.

## Verification

`pnpm test:lint-config` checks actual Oxlint diagnostics, nested configuration discovery, ignored generated files, formatting, and tooling dependencies. It also runs with `pnpm test`. Fixture tests create temporary inputs and invoke the official CLI; they do not implement fixes. Temporary fixtures are cleaned up. Turbo caching is disabled for this suite because it exercises configurations in other workspaces.

React component, Hooks, and Compiler checks use Oxlint's native `react` plugin. TypeScript checks prop types. Runtime `propTypes` declarations are not required. The UI rejects unused underscore-prefixed arguments; apps allow unused arguments, caught errors, underscore-prefixed destructured array items, and rest siblings. Both reject values used only in type queries.
