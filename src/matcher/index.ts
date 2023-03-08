import { numberMatcher, stringMatcher } from './parsers';
import { MatchError } from './error';
import { Matcher } from './types';
import { booleanMatcher } from './parsers/boolean';

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
/**
  * Match a boolean using literals
* */
function match<
  MatchReturnType,
>(val: boolean, matcherOptions: Matcher<boolean, MatchReturnType>): MatchReturnType;
function match<
  MatchType extends string | number | boolean,
  MatchReturnType,
>(val: MatchType, matcherOptions: Matcher<MatchType, MatchReturnType>): MatchReturnType {
  // Check val type to determine matcher type to use
  // We can asset based on val type, that corresponding matcher options are valid
  // as they are based on the same generic

  if (typeof val === 'string') {
    return stringMatcher<MatchReturnType>(
      val,
      matcherOptions as Matcher<string, MatchReturnType>,
    );
  }

  if (typeof val === 'number') {
    return numberMatcher<MatchReturnType>(
      val,
      matcherOptions as Matcher<number, MatchReturnType>,
    );
  }

  if (typeof val === 'boolean') {
    return booleanMatcher<MatchReturnType>(
      val,
      matcherOptions as Matcher<boolean, MatchReturnType>,
    );
  }

  throw new MatchError({
    message: `Unable to match type ${typeof val}`,
    status: MatchError.StatusCodes.UNSUPPORTED_TYPE,
  });
}

export * from './types';
export { match };
