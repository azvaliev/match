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

export type MatcherDefaultHandler<
  MatchType,
  MatchReturnType,
> = (arg0: MatchType) => MatchReturnType;

type BooleanTrueCase<MatchReturnType> = [true, (exact: true) => MatchReturnType];
type BooleanFalseCase<MatchReturnType> = [false, (exact: false) => MatchReturnType];

export type Matcher<MatchType, MatchReturnType> =
    MatchType extends Maybe<string>
      ? ArrayWLast<
      [
        | string
        | string[]
        | Set<string>
        | RegExp,
        (exact: string) => MatchReturnType,
      ],
      MatcherDefaultHandler<MatchType, MatchReturnType>
      >
      : MatchType extends Maybe<number>
        ? ArrayWLast<
        [
          | number
          | number[]
          | Set<number>
          | MatchNumberComparison,
          (exact: number) => MatchReturnType,
        ],
        MatcherDefaultHandler<MatchType, MatchReturnType>
        >
        : MatchType extends boolean
          ? [
            BooleanTrueCase<MatchReturnType>,
            MatcherDefaultHandler<false, MatchReturnType>,
          ] | [
            BooleanFalseCase<MatchReturnType>,
            MatcherDefaultHandler<true, MatchReturnType>,
          ] | [
            BooleanTrueCase<MatchReturnType>,
            BooleanFalseCase<MatchReturnType>,
          ] | [
            BooleanFalseCase<MatchReturnType>,
            BooleanTrueCase<MatchReturnType>,
          ]
          : never;
