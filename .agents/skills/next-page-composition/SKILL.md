---
name: next-page-composition
description: Create or edit Next.js App Router routes using server-first page shells, page metadata, shared page and layout props, and focused client boundaries.
---

# Next Page Composition

Use this when creating or materially editing Next.js App Router pages, layouts, or their client/server boundaries. Follow the target project's source root, import aliases, package manager, and test configuration. Paths below use `src/` as an example; adapt them for projects with a root `app/` directory.

For general component structure, JSX handlers, and prop passing, apply the companion [React Component Conventions](../react-component-conventions/SKILL.md) when installed. This skill contains only Next.js-specific conventions and can be used independently.

## Page Contract

Treat `src/app/**/page.tsx` as the route shell:

- Pages are server components by default. Keep `"use client"` out of `page.tsx`; move state, event handlers, browser APIs, and store hooks into child components.
- Every non-layout route page has its own `metadata` export typed with `Metadata` from `next`. Add or repair metadata when touching a page.
- Add `"use client"` only to child component files that directly need client behavior.
- Keep route files short and readable. A page should mostly import components, export metadata, declare a named `*Page` const arrow component, compose the page surface, and export it as default in a separate statement.
- When a route starts carrying feature UI, extract sections into components instead of letting the page grow past about 100 lines.

## Shared page and layout props

Maintain a shared `types/App.types.ts` file in the target project. Place `types` at the same directory level as `app` or `components`: use `src/types/App.types.ts` when those directories are under `src/`, or root-level `types/App.types.ts` when they are at the project root.

The file must define these shared types, preserving any unrelated existing exports:

```ts
// Pages and layouts types and interfaces
import type { ReactNode } from "react";

export type PageProps = Readonly<{ children: ReactNode; }>;

export type LayoutProps = Readonly<{ children: ReactNode; }>;
```

Any page-specific props created must extend this shared `PageProps`; any layout-specific props created must extend this shared `LayoutProps`. Import the base with `import type` using the project's alias or relative path. Use interface `extends` or a type intersection to add fields, and use the shared type directly when no additional fields are needed. Keep these declarations in the appropriate `.types.ts` file.

Extending a readonly base does not make newly added fields readonly. Apply `Readonly` to the complete props parameter type when it is not already wrapped. When importing the shared `PageProps` or `LayoutProps` directly as `Props`, use `props: Props` without a redundant wrapper.

## Verification

For route changes, run the smallest useful checks using the target project's package manager and available scripts, usually a focused test first and then type or lint checks when the change touches shared behavior.
