# Match

Everything that `switch` could've been. 🚀  
Inspired from Rust. 🦀

```bash
pnpm install @azvaliev/match
```

- [Introduction](#introduction)
- [Installation](#getting-started-installation)
- [`match()`](#basic-usage)
  - [`Value`](#value)
  - [`Pattern`](#pattern)
  - [`MatchHandler`](#matchhandler)
- [Return Values](#return-values)
- [Error Handling](#error-handling)
  - [Philosophy](#philosophy)
  - [`MatchError`](#matcherror)

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

\* exclusive range meaning the high number is **not included**,
inclusve range meaning the high number **is included**

### `MatchHandler`

`(val: string | number | boolean) => unknown`

A callback function which recieves your value as the first and only parameter.
It can can optionally return any value which will be passed through and returned from `match`.

## Return Values

The return type from `match()` is a union of all its different `MatchHandler` return types.

```typescript
const result = match(someString, [
  // first MatchHandler returns 'a'
  ['foo', () => 'a'],

  // second MatchHandler returns 'b' 
  ['bar', () => 'b'],

  // default case MatchHandler returns 'c'
  () => 'c'
]);

result; // 'a' | 'b' | 'c'
```

Should TypeScript fail to infer the return type properly (or not specific enough), you can also specify this 
explicitly in the generic constraint.

```typescript
// TypeScript will still validate this generic constraint is met,
// via the return types of your MatchHandler(s)
const result = match<string, 'x' | 'y' | 'z'>(someString, [/* ... */]);

result; // 'x' | 'y' | 'z'
```

## Error Handling

### Philosophy

Generally, `match` will not throw exceptions, and prefer logging them under `console.error`.
There are two main reasons that `match` will throw an exception for.

1. Missing a default case handler. TypeScript **will** warn you about this.
The default case handler is required, even if it's just an empty function.
2. Unsupported type supplied. `match` only works with strings, numbers, and booleans as of this time.
Expect supplying any other types to throw an error.

### `MatchError`

`match` will only ever throw errors that are instances of `MatchError`. An error can be easily identified by checking
it's `status` property.

```typescript
try {
  match(someValue, [/* ... */])
} catch (err) {
  if (err instanceof MatchError) {
    err.name; // "MatchError"
    err.status; // member of enum MatchError.StatusCodes
  }
}
```
