# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/oxlint-config`: shared Oxlint configurations and rule tests
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) for code linting
- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) for code formatting

### Code checks

Use Node.js 22.18+ on the 22.x release line, or Node.js 24+, to load the TypeScript lint configurations.

- `pnpm lint` checks the repository using the root configuration and each workspace's nearest configuration. Any warning fails the command.
- `pnpm check-format` checks formatting; `pnpm format` applies it.
- `pnpm check-types` runs TypeScript.
- `pnpm test:lint-config` verifies lint rules and formatting. These checks also run with `pnpm test`.

Formatting uses a 120-character width, double quotes, semicolons, two-space indentation, and no trailing commas. Oxlint checks import grouping, ordering, and TypeScript alias resolution.

See [the lint configuration notes](packages/oxlint-config/README.md) for configuration details and JavaScript plugins.

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Updating Dependencies

This monorepo provides a convenient script to update all dependencies across the workspace package manifests.

### Usage

To update all dependencies, run:

```sh
pnpm run update-dependencies
```

This script will:

- Update all workspace `package.json` dependencies.
- Install the updated dependencies automatically.

### Requirements

- **npm-check-updates**: This is used internally by the script and should already be installed as a dev dependency. However, it's recommended to also install it globally for easier manual usage:
  ```sh
  npm install -g npm-check-updates
  ```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
