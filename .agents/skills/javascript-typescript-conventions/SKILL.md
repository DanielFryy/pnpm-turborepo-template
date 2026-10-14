---
name: javascript-typescript-conventions
description: Apply JavaScript and TypeScript conventions for blank lines, declaration order, default exports, compact objects and types, destructuring, long strings, function bodies, and conditional braces when writing or reviewing JS, TS, JSX, or TSX.
---

# JavaScript and TypeScript conventions

Apply these conventions to code being written or edited. They also apply to callbacks and component functions.

## Blank lines and declaration order

Leave one blank line before every `export` or `return` when preceding code exists in the same scope. This includes named exports, default exports, re-exports, and early returns. Do not add a leading blank line at the start of a file or block, or separate a `return` from its expression. For a one-line guard such as `if (!value) return;`, put the separating blank line before the whole guard when it follows other code.

Separate declarations such as functions, types, interfaces, classes, and enums from surrounding code with one blank line above and below. Consecutive non-function `const` declarations may stay together without blank lines. A function stored in a `const` is still a function: separate it from data declarations and other functions, even when its body fits on one line. Exported constants still require a blank line before each `export`.

Within each scope, place non-function `const`/`let` declarations before function declarations and function-valued constants. Preserve initialization dependencies and execution order when refactoring; if this ordering cannot be achieved without changing behavior, report the conflict instead of moving declarations mechanically. Blank lines separate neighboring code; they are not needed immediately inside opening or closing braces.

```ts
type Label = string;

interface NamedValue { label: Label; }

const value = 0;
const square = 2;
const root = "any value";

const foo = () => {};

const foo2 = () => {};

function foo3() {}

const getLabel = (item: NamedValue) => {
  const { label } = item;

  if (!label) return root;

  return label;
};

export { foo, foo2, foo3, getLabel };

export default root;
```

## Default exports of constants

When a value needs a default export, assign it to a named local `const` first, then export that identifier in a separate `export default` statement. Do not default-export the expression directly. This applies to any kind of constant, including objects, arrays, primitives, function expressions, and values returned by calls; it is not limited to tool configurations.

```ts
// Avoid
export default defineConfig({});

// Prefer
const config = defineConfig({});

export default config;
```

Use a descriptive local name. If that name conflicts with an import or another binding, choose a different, more explicit name for the local constant:

```ts
import config from "./base-config";

const projectConfig = defineConfig(config);

export default projectConfig;
```

## Formatter and line width

Use the project's configured formatter, such as Prettier, oxfmt, Biome, or another formatter. Read its configuration and any overrides or command options that apply to the file to determine the effective print width or line width. If no width is configured, use that formatter's default. If no formatter is configured, follow the project's documented line-width convention or surrounding code style.

Apply this width to every rule below about fitting on one line, including indentation and surrounding syntax. Run the project's formatter after edits. If it forces a different layout, report the conflict rather than changing formatter settings or adding ignore directives solely to enforce this convention.

## Long strings in expressions

When an inline string makes a call or another expression exceed the effective line width, extract the string into a descriptively named local `const` and use that identifier in the expression. Merely wrapping the call around the inline string does not satisfy this rule. Keep the constant in the narrowest appropriate scope, such as inside the conditional branch where it is used, and preserve the string's exact value and evaluation order, including any template-literal interpolations.

```ts
// Avoid
if (anyCondition) {
  console.error("Really long text just to prove a point where one line can exceed the line width limit set in config.");
}

// Prefer
if (anyCondition) {
  const message =
    "Really long text just to prove a point where one line can exceed the line width limit set in config.";
  console.error(message);
}
```

Let the formatter lay out the constant declaration. A string literal can still exceed the width on its own; keep it intact rather than inserting newlines into its value or splitting it into concatenated fragments solely to meet the width.

## Compact object literals

Write an object literal on one line when the complete resulting line fits within the project's line width. Apply this to nested objects independently: an inner object can fit on one line even when its parent needs multiple lines. Preserve comments and content that require line breaks.

```ts
JSON.stringify({
  fingerprint: { name, size, lastModified },
  lastPage: 1,
  zoom: "fit-to-width"
});
```

## Compact types and interfaces

Apply the same one-line rule to TypeScript object type literals, type aliases, and interface declarations. Keep them on one line when the complete resulting line fits within the project's line width, including indentation, declaration names, generic wrappers such as `Readonly<...>`, and surrounding syntax. Apply the rule to nested types independently, and preserve comments and content that require line breaks.

When an inline parameter type fits, also collapse the surrounding function signature onto one line if the entire signature through the opening body brace fits. A multiline function body does not require a multiline signature. Preserve the existing type structure and follow the project's formatter for member separators.

```ts
type LayoutProps = Readonly<{ children: React.ReactNode; }>;

interface NamedItem { name: string; }
```

```tsx
const RootLayout = (props: Readonly<{ children: React.ReactNode; }>) => {
  const { children } = props;

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};
```

## Object parameters

Accept each object parameter by name and destructure it inside the function body. Never destructure an object in a function signature.

```ts
const getLabel = (options: LabelOptions) => {
  const { name, prefix } = options;

  return `${prefix}${name}`;
};
```

## Repeated object access

When accessing properties on the same object more than once, destructure the needed properties into local bindings instead of repeating `object.property`. This includes accesses inside nested callbacks and repeated reads of the same property.

Destructure directly from a function or hook result when one declaration is enough:

```ts
const { value, execute } = createController();

const performAction = () => {
  execute(value);
};
```

When destructuring needs multiple declarations to fit the project's print width, save the result in a descriptively named local constant first, then destructure that same object across declarations. Keep the original object when it is also needed for forwarding or another use. Never repeat a function or hook call just to extract additional properties; preserve its invocation count and location.

Follow the long-destructuring rules below when splitting declarations. Preserve behavior when extracting properties: keep reads at the point where their current values are needed, and retain the receiver for methods that depend on `this`. Do not turn a live property read into a stale captured value or change getter evaluation as part of this style refactor.

## Long destructuring declarations

Use the effective line width from the formatter guidance above. When an object destructuring declaration would exceed that width, split it into declarations that each fit. If the remaining object is not needed, read the original object in each declaration:

```ts
const { key1, key2, key3 } = obj;
const { key4, key5, key6 } = obj;
const { key7, key8, key9 } = obj;
```

Use chained `rest1`, `rest2`, and so on only when the final remaining object has a separate use, such as forwarding unconsumed props to another component. Each declaration reads the preceding rest object, so the final remainder excludes every extracted key:

```ts
const { key1, key2, key3, ...rest1 } = obj;
const { key4, key5, key6, ...rest2 } = rest1;
const { key7, key8, key9, ...rest3 } = rest2;
consumeRemainingOptions(rest3);
```

These examples show the grouping pattern. Choose the number of keys per declaration to fit the configured width, including indentation and any rest binding. Create rest objects for their remaining properties, not just to wrap lines.

## Guard clauses and conditional bodies

Avoid nested "arrow code" by using guard clauses. When a trailing `if` has no `else` and no code after it, invert the condition and return early, then put the work at the surrounding indentation level. Preserve the original return value and behavior when making this change.

```ts
const processKey = (key: string) => {
  if (key !== "Enter") return;
  submit();
};
```

Omit braces for an `if` body only when the entire `if` statement, including the condition and its single body statement, stays on one line within the effective line width after formatting. If the body starts on a new line, always enclose it in `{` and `}`, even if the body itself is only one line. A multiline condition or body also requires braces. Apply the same rule to `else if` and `else` bodies: a body on a new line must be braced.

```ts
// Avoid
if (anyCondition)
  console.error(message);

// Prefer when keeping the body on a new line
if (anyCondition) {
  console.error(message);
}
```

Keep braces when JavaScript syntax or control flow requires them, such as for multiple statements, lexical declarations, or avoiding a dangling `else`. Recheck after formatting: if an unbraced conditional wraps onto multiple lines, add braces and format again. This conditional-body rule does not change the explicit-body requirement for multiline functions below.

## Multiline functions

Every function spanning more than one line must have an explicit body enclosed in `{` and `}`. This includes arrow functions with multiline parameters or multiline expressions. Use an explicit `return` when the function returns a value, object, or JSX. Object-literal braces alone do not count as a function body.

```ts
const createResult = (value: number) => {
  return { value, valid: Number.isFinite(value) };
};
```

Single-line arrow functions may use an implicit return. If formatting makes one span multiple lines, convert it to a block body and format it again.

## Functions in objects

Define a function inline in an object only when its entire property definition fits on one line after formatting. Extract any longer function into a local `const` arrow function before constructing the object, then reference it from the property. Use property shorthand when the local name matches the key; otherwise preserve the key with `key: localFunction`.

This applies to any object containing functions, including returned objects, assigned objects, configuration objects, and objects passed as arguments. Hook return values are only one example. Apply it to both function-valued properties and method shorthand. When refactoring an existing method, preserve its receiver behavior and any use of `this`, `arguments`, or `super` rather than mechanically changing its semantics.

```ts
const createActions = () => {
  const start = () => {
    resetProgress();
    beginProcessing();
  };

  return {
    start,
    stop: () => setIsRunning(false)
  };
};
```
