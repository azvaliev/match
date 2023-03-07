import { numberMatcher, stringMatcher } from './parsers';
import { MatchError } from './error';
import { Matcher } from './types';

/**
  * Match a number using arrays, ranges, greater than or less than
* */
function match(val: number, matcherOptions: Matcher<number>): void;
/**
  * Match a string using RegExp pattern matching or literals
* */
function match(val: string, matcherOptions: Matcher<string>): void;
function match<T extends string | number>(val: T, matcherOptions: Matcher<T>): void {
  // Check val type to determine matcher type to use
  // We can asset based on val type, that corresponding matcher options are valid
  // as they are based on the same generic

  if (typeof val === 'string') {
    return stringMatcher(val, matcherOptions as Matcher<string>);
  }

  if (typeof val === 'number') {
    return numberMatcher(val, matcherOptions as Matcher<number>);
  }

  throw new MatchError({
    message: `Unable to match type ${typeof val}`,
    status: MatchError.StatusCodes.UNSUPPORTED_TYPE,
  });
}

export * from './types';
export { match };
