import { numberMatcher, stringMatcher } from './parsers';
import { MatchError } from './error';
import { Matcher } from './types';
import { booleanMatcher } from './parsers/boolean';
import { getDefaultHandler } from './utils';

// So I don't have to break lines manually on the docs
/* eslint-disable max-len */
/**
  * Match strings, numbers or booleans using a variety of methods
  * @see {@link https://github.com/azvaliev/match Github Documentation}
  * @param {(string | number | boolean)} value - The value you want to match against
  * @param {(Matcher<MatchType, MatchReturnType>)} matcher - Provide an array of matchers, with the last being a default case handler function
  *
  * @throws MatchError on invalid input
  * @returns {MatchReturnType} A union of the return types of your various match handler functions
  *
  * @example
  * // Matching a Number
  *
  * match(myNum, [
  *   ['<5', () => { console.log('the number is less than 5') }],
  *   [5, () => { console.log('the number is five') }],
  *   ['6..12', () => { console.log('the number is between 6 and 12') }],
  *   () => { console.log('default case') }
  * ]);
  * */
function match<
  MatchType extends string | number | boolean | null | undefined,
  MatchReturnType,
>(value: MatchType, matcher: Matcher<MatchType, MatchReturnType>): MatchReturnType;
function match<
  MatchType extends string | number | boolean | null | undefined,
  MatchReturnType,
>(value: MatchType, matcher: Matcher<MatchType, MatchReturnType>): MatchReturnType {
  /* eslint-enable max-len */
  // Check val type to determine matcher type to use
  // We can asset based on val type, that corresponding matcher options are valid
  // as they are based on the same generic

  try {
    if (typeof value === 'string') {
      return stringMatcher<MatchReturnType>(
        value,
        matcher as Matcher<string, MatchReturnType>,
      );
    }

    if (typeof value === 'number') {
      return numberMatcher<MatchReturnType>(
        value,
        matcher as Matcher<number, MatchReturnType>,
      );
    }

    if (typeof value === 'boolean') {
      return booleanMatcher<MatchReturnType>(
        value,
        matcher as Matcher<boolean, MatchReturnType>,
      );
    }
  } catch (err) {
    console.error(err);
  }

  const defaultHandler = getDefaultHandler<typeof value, MatchReturnType>(matcher);
  return defaultHandler(value);
}

export * from './types';
export { match };
