import stringMatcher from './string';

// Number comparisons
export type MatchGreaterThanNum = `>${number}`;
export type MatchLessThanNum = `<${number}`;
export type MatchRangeNum = `${number}..${number}`;
export type MatchIncRangeNum = `${number}..=${number}`;

export type Maybe<T> = T | null | undefined;

/**
 * Array of Type T,
 * Except Last Element enforced of type L
 */
type ArrayWLast<T, L> = [...T[], L];

export type Matcher<T> =
    T extends Maybe<string>
      ? ArrayWLast<[string | RegExp, (_: string) => void], (_: string) => void>
      : T extends Maybe<number>
        ? ArrayWLast<
        [
          | number
          | number[]
          | MatchGreaterThanNum
          | MatchLessThanNum
          | MatchRangeNum
          | MatchIncRangeNum,
          (exact: number) => void,
        ],
        (_: T) => void
        >
        : T extends Maybe<boolean>
          ? ArrayWLast<(
            [true, (exact: true) => void] |
            [false, (exact: false) => void]
          ), (_: T) => void>
          : never;

/**
  * Match a number using arrays, ranges, greater than or less than
* */
function matcher(val: number, matcherOptions: Matcher<number>): void;
/**
  * Match a string using RegExp pattern matching or literals
* */
function matcher(val: string, matcherOptions: Matcher<string>): void;
function matcher<T>(val: T, matcherOptions: Matcher<T>): void {
  // Check val type to determine matcher type to use

  if (typeof val === 'string') {
    stringMatcher(val, matcherOptions as Matcher<string>);
  }
}

export { matcher };
