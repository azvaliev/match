# Match

- [Features](#features)
- [Getting Started](#getting-started)
- [Documentation](#documentation)

This is `match`, a TypeScript library inspired by the `match {}` from Rust.
I like to think of it as everything `switch` in JavaScript could've been.

Hate seeing nested ternarys in your codebase? This might be just thing you need.

```ts
const myResult = match(aString, [
  [["some_result", "another_result"], (result) => true],
  (defaultCase) => false
]);
```

## Features
- Use `switch`-like syntax without needing to only match basic cases
- Achieve conciseness in expressions without the need for a ternary
- Match `string` against `string[]`, `string`, `Set<string>`, or even regular expressions!
- Match `number` with `number[]`, `number`, `Set<number>`, and ranges! (inclusive and exclusive)
- Match `booleans` against, well, booleans. But in a more elegant syntax!

## Getting Started

First, install with package manager of choice

```bash
npm install @azvaliev/match
# OR
yarn add @azvaliev/match
# OR
pnpm install @azvaliev/match
```

Then, import as needed!

```typescript
import { match } from '@azvaliev/match';

match(myVal, [
  // ...
]);
```

## Documentation

For familiarity and a good starting point, I've tried to emulate Rust's [match](https://doc.rust-lang.org/rust-by-example/flow_control/match.html)
API as closely as possible. However, some variance is inevitable.

The documentation should be comprehensive and without issue, please feel free to 
[file an issue on Github](https://github.com/azvaliev/match/issues) if anything.

todo!

- [`match` fundamentals]
- [error handling]
- [`string` matching]()
  - [literals]()
  - [array and Set]()
  - [Regular Expressions]()
- [`number` matching]()
  - [Literals]()
  - [Array and Set]()
  - [Comparison - Greater Than / Less Than]()
  - [Ranges]()
- [`boolean` matching]()
  - [`Literals`]
  - [`Default Case`]
