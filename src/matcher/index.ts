import { numberMatcher, stringMatcher } from './parsers';
import { MatchError } from './error';
import { Matcher } from './types';

/**
  * Match a number using arrays, ranges, greater than or less than
* */
function match<
  MatchReturnType,
>(val: number, matcherOptions: Matcher<number, MatchReturnType>): MatchReturnType;
/**
  * Match a string using RegExp pattern matching or literals
* */
function match<
  MatchReturnType,
>(val: string, matcherOptions: Matcher<string, MatchReturnType>): MatchReturnType;
function match<
  MatchType extends string | number,
  MatchReturnType,
>(val: MatchType, matcherOptions: Matcher<MatchType, MatchReturnType>): MatchReturnType {
  // Check val type to determine matcher type to use
  // We can asset based on val type, that corresponding matcher options are valid
  // as they are based on the same generic

  if (typeof val === 'string') {
    return stringMatcher<MatchReturnType>(val, matcherOptions as Matcher<string, MatchReturnType>);
  }

  if (typeof val === 'number') {
    return numberMatcher<MatchReturnType>(val, matcherOptions as Matcher<number, MatchReturnType>);
  }

  throw new MatchError({
    message: `Unable to match type ${typeof val}`,
    status: MatchError.StatusCodes.UNSUPPORTED_TYPE,
  });
}

export * from './types';
export { match };
