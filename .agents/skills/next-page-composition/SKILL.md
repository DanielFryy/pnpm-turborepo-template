---
name: next-page-composition
description: Create or edit Next.js App Router pages and their components using server-first routes, page metadata, and small colocated components.
---

# Next Page Composition

Use this when creating or materially editing an App Router page or a component that belongs to a page surface in a Next.js project. Follow the target project's source root, import aliases, package manager, and test configuration. Paths below use `src/` as an example; adapt them for projects with a root `app/` directory.

## Page Contract

Treat `src/app/**/page.tsx` as the route shell:

- Pages are server components by default. Keep `"use client"` out of `page.tsx`; move state, event handlers, browser APIs, and store hooks into child components.
- Every non-layout route page has its own `metadata` export typed with `Metadata` from `next`. Add or repair metadata when touching a page.
- Keep route files short and readable. A page should mostly import components, export metadata, declare a named `*Page` component, compose the page surface, and export it as default.
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

Extending a readonly base does not make newly added fields readonly. Apply the parameter rule below to the complete props type, not just its base.

## Component Shape

Declare components, including route pages, as named `const` arrow functions and export them as default in a separate statement. Use this form instead of the `function` keyword:

```tsx
const ComponentName = () => {
  return <div />;
};

export default ComponentName;
```

Put each component in a dedicated directory named after the component:

```text
src/components/<domain>/<ComponentName>/
|-- ComponentName.tsx
|-- ComponentName.types.ts
|-- ComponentName.test.tsx
|-- ComponentName.hooks.tsx
`-- ComponentName.helpers.ts
```

Use the same PascalCase basename for every component-owned file. Add only the sibling files that have real content: props and local types in `.types.ts`, custom hooks in `.hooks.tsx`, helper functions and fixed data in `.helpers.ts`, and behavior or render coverage in `.test.tsx`.

Keep every newly created `ComponentName.tsx` under 150 lines of code. Extract child components, helpers, or fixed data before the component grows past that limit.

Keep type and interface declarations out of `ComponentName.tsx`. Put component-owned types in `ComponentName.types.ts`, or use a global type file when the type is shared outside the component boundary. When creating `ComponentName.types.ts`, make its first line:

```ts
// ComponentName types and interfaces
```

When `ComponentName.types.ts` defines the component props, name that type `ComponentNameProps`. Import it in `ComponentName.tsx` as:

```ts
import type { ComponentNameProps as Props } from "./ComponentName.types";
```

The component must use the imported `Props` alias for its parameter. Use `props: Readonly<Props>` only when the complete imported type is not already wrapped in TypeScript's `Readonly` utility type. If it is already wrapped, including through a type alias, use `props: Props` without adding another wrapper. Accept the parameter as `props` and destructure it inside the function body:

```tsx
const ComponentName = (props: Readonly<Props>) => {
  const { children } = props;
  return <div>{children}</div>;
};

export default ComponentName;
```

This example assumes `ComponentNameProps` includes `children`; destructure only the props the component actually uses.

For example, if the type file declares `export type ComponentNameProps = Readonly<{ children: ReactNode; }>;`, the component signature must be `const ComponentName = (props: Props) => { ... };`. The shared `PageProps` and `LayoutProps` above are also already wrapped, so use `props: Props` when importing either directly as `Props`.

When creating `ComponentName.helpers.ts`, make its first line:

```ts
// ComponentName helper functions and data
```

Keep type and interface declarations out of `ComponentName.helpers.ts`; they belong in `ComponentName.types.ts` or a shared global type file. Keep custom hooks out of helpers too: if a component needs a custom hook, put it in `ComponentName.hooks.tsx` so helpers stay limited to fixed data and pure functions.

Use the project's shared render helper for tests. When the project exposes it as `setupTests`, import `render` from that module as shown below; otherwise use the existing equivalent. With a configured component test runner, every component needs at least one default-props render test. Supply the minimum valid props when props are required. If no test runner exists, report that gap instead of adding a new test framework solely for this convention:

```tsx
import ComponentName from "./ComponentName";
import { render } from "setupTests";

describe("ComponentName", () => {
  it("renders with default props", () => {
    render(<ComponentName />);
  });
});
```

## Local Style

- Prefer project aliases for cross-directory imports and relative imports for sibling component files.
- Add `"use client"` only to the component file that directly needs client behavior.
- Compose page-level UI from existing global, UI, provider, and domain components before adding a new abstraction.
- Keep class names consistent with the current Tailwind style, including a root class matching the component name when the local pattern uses one.

## JSX events and rendering

When installed, apply the companion [JavaScript and TypeScript conventions](../javascript-typescript-conventions/SKILL.md) when writing component functions or callbacks. Install both skills for the full convention set; this skill can also be used on its own.

- Name locally declared JSX event handlers `<subject><Event>Handler`, such as `searchChangeHandler` or `saveClickHandler`, for both native and custom component events. Functions received through props may be passed directly to JSX under their existing names, such as `onDragLeave={handleDragLeave}`. When adding local logic around a received function, give the local wrapper a handler name and call the received function inside it. The naming rule applies only to locally declared handlers; do not wrap or rename received functions solely to satisfy it.
- Declare event handlers outside JSX. An inline callback is allowed only when it fits on one line after formatting; this is also the exception to handler naming. Extract any longer callback into a named handler before the component's return.
- Render conditional content without an alternative as `condition ? <Element /> : null`.
- When a component accepts a `className` prop, merge component classes with `twMerge`, placing the caller's `className` last so caller styles can override defaults. This rule applies only to components with a `className` prop.

```tsx
const saveClickHandler = () => {
  saveChanges();
  closeDialog();
};

return (
  <div className={twMerge("Editor flex flex-col", className)}>
    {isReady ? <button onClick={saveClickHandler}>Save</button> : null}
  </div>
);
```

## Passing props

Prefer spreading an existing object into a child component when its keys match the prop names and its values can be passed unchanged. Use `<ChildComponent {...data} />` instead of repeating assignments such as `value={data.value}` for every prop. This also applies when different child components consume different subsets of the same object.

Keep explicit props for renamed or transformed values. Put intentional overrides after the spread. Before replacing explicit assignments, check that extra keys do not change the child's behavior or get forwarded unintentionally to a DOM element; select the needed subset when the whole object cannot be passed safely.

Do not explicitly pass a prop that is already included in a spread with the same unchanged value. Destructuring a value from the spread object does not make it an override: use `<ChildComponent {...props} />` instead of `<ChildComponent {...props} value={value} />` when `value` comes unchanged from `props`. Keep explicit props when they add a missing key or intentionally change its value.

When removing a redundant prop, preserve type safety. A guard can narrow a destructured binding without narrowing the original object's property type. If the child requires that narrower type, adjust the prop types or construct an appropriately typed subset instead of adding a type assertion or retaining the duplicate solely to satisfy TypeScript.

```tsx
return <ChildComponent {...data} />;
```

## Verification

For page or component changes, run the smallest useful checks using the target project's package manager and available scripts, usually a focused test first and then type or lint checks when the change touches shared behavior.
