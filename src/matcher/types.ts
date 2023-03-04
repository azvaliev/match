// Number comparisons
export type MatchGreaterThanNum = `>${number}`;
export type MatchLessThanNum = `<${number}`;
export type MatchRangeNum = `${number}..${number}`;
export type MatchIncRangeNum = `${number}..=${number}`;

export type MatchNumberComparison =
  | MatchGreaterThanNum
  | MatchLessThanNum
  | MatchRangeNum
  | MatchIncRangeNum;

export type Maybe<T> = T | null | undefined;

/**
 * Array of Type T,
 * Except Last Element enforced of type L
 */
type ArrayWLast<T, L> = [...T[], L];

export type MatcherDefaultHandler<T> = (arg0: T) => void;

export type Matcher<T> =
    T extends Maybe<string>
      ? ArrayWLast<
      [
        | string
        | string[]
        | Set<string>
        | RegExp,
        (_: string) => void,
      ],
      MatcherDefaultHandler<T>
      >
      : T extends Maybe<number>
        ? ArrayWLast<
        [
          | number
          | number[]
          | Set<number>
          | MatchNumberComparison,
          (exact: number) => void,
        ],
        MatcherDefaultHandler<T>
        >
        : T extends Maybe<boolean>
          ? ArrayWLast<(
            [true, (exact: true) => void] |
            [false, (exact: false) => void]
          ), MatcherDefaultHandler<T>>
          : never;
