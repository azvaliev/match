# Match

Everything that `switch` could've been. 🚀  
Inspired from Rust. 🦀

```bash
pnpm install @azvaliev/match
```

- [Introduction](#introduction)
- [Installation](#getting-started-installation)
- [Basic Usage](#basic-usage)
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
FDFS- [`boolean` matching]()
  - [`Literals`]
  - [`Default Case`]

### Introduction

`match` is a typesafe pattern matching library, designed to make writing and reading conditional logic
simple, concise, and extensible. You can think of it like everything `switch` could've been.

Simply put, goal of this library is to make your conditional logic simpler, more typesafe, and easier
to use.

#### Side Benefits

- MIT Licensed
- Zero dependencies
- TypeScript is optional, but well integrated
- Works in both NodeJS and the browser
- **Under 3kb** when minified and gzipped

## Getting Started / Installation

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

match(myString, [
  ['hello world', () => {
    console.log('Matched!');
  }],
  () => {
    console.log('default');
  }
]);
```

## Basic Usage

The `match` function takes two arguments, your value and an array of matchers.  

Each matcher is a tuple containing a `[Pattern, MatchHandler]` except for the last value in the array which is just a `MatchHandler`,
outside a tuple, serving as a default case.

When the first `Pattern` that matches your value is found, the corresponding `MatchHandler` will be executed.
If none are matching, the last `MatchHandler` will executed.

```typescript
match(
  Value, 
  [...Array<[Pattern, MatchHandler]>, MatchHandler],
)
``````

### `Value`

`string | number | boolean`

Whatever value you want to pattern match against.

### `Pattern`

Given a certain type for the `Value`, this shows the corresponding `Pattern` types available.

**Value: `number`**
  - `number`
  - `Array<number>`
  - `Set<number>`
  - Exclusive Range* `"start..end"`
  - Inclusive Range* `"start..=end"`
  - Greater than `">number"`
  - Less than `"<number"`

**Value: `string`**
  - `string`
  - `Array<string>`
  - `Set<string>`
  - `RegExp`

**Value: `boolean`**
  - `true`
  - `false`

### `MatchHandler`

`(val: string | number | boolean) => unknown`

A callback function which recieves your value as the first and only parameter.
It can can optionally return any value which will be passed through and returned from `match`.
