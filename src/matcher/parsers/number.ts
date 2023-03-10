import type { Matcher, MatchNumberComparison } from '../types';
import { MatchError } from '../error';
import { getDefaultHandler } from '../utils';

function numberMatcher<
  MatchReturnType,
>(val: number, matchOptions: Matcher<number, MatchReturnType>): MatchReturnType {
  const defaultMatchHandler = getDefaultHandler<number, MatchReturnType>(matchOptions);

  for (let i = 0; i < matchOptions.length - 1; i += 1) {
    const matchOption = matchOptions[i];
    if (!Array.isArray(matchOption)) {
      break;
    }

    const [pattern, matchHandler] = matchOption;

    // number
    if (typeof pattern === 'number') {
      if (pattern === val) {
        return matchHandler(val);
      }
      // handle NaN
      if (Number.isNaN(pattern) && Number.isNaN(val)) {
        return matchHandler(val);
      }
    } else if (typeof pattern === 'object') {
      // number[]
      if (Array.isArray(pattern)) {
        if (pattern.includes(val)) {
          return matchHandler(val);
        }
      // Set<number>
      } else if (pattern instanceof Set) {
        if (pattern.has(val)) {
          return matchHandler(val);
        }
      }
    } else {
      try {
        const matched = parseAndEvaluateNumberComparison(pattern, val);

        if (matched) {
          return matchHandler(val);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  return defaultMatchHandler(val);
}

export { numberMatcher };
export default {};

/**
  * Parse a string like '>60' | '<120' | '20..45' | '80..=20'
  * into a comparison or range
  * */
function parseAndEvaluateNumberComparison(matcher: MatchNumberComparison, val: number): boolean {
  if (matcher.charAt(0) === '>') {
    return val > parseFloat(matcher.slice(1));
  }
  if (matcher.charAt(0) === '<') {
    return val < parseFloat(matcher.slice(1));
  }

  let parserPosition = 0;
  let rawRangeStart = '';

  // While next two characters are not .. which would indicate middle of range
  while (matcher.charAt(parserPosition) !== '.' || matcher.charAt(parserPosition + 1) !== '.') {
    const char = matcher.charAt(parserPosition);
    rawRangeStart += char;

    if (char === '') {
      throw new MatchError({
        message: `Failed to parse numerical matcher '${matcher}'`,
        status: MatchError.StatusCodes.BAD_MATCHER,
      });
    }

    parserPosition += 1;
  }

  const parsedRangeStart = parseFloat(rawRangeStart);
  if (Number.isNaN(parsedRangeStart)) {
    throw new MatchError({
      message: `Failed to parse start of range '${rawRangeStart}'`,
      status: MatchError.StatusCodes.BAD_MATCHER,
    });
  }

  parserPosition += 2;
  const inclusive = matcher.charAt(parserPosition) === '=';
  if (inclusive) {
    // Skip the =
    parserPosition += 1;
  }

  const rawRangeEnd = matcher.slice(parserPosition);
  const parsedRangeEnd = parseFloat(rawRangeEnd);

  if (Number.isNaN(parsedRangeEnd)) {
    throw new MatchError({
      message: `Failed to parse end of range '${rawRangeEnd}'`,
      status: MatchError.StatusCodes.BAD_MATCHER,
    });
  }

  if (inclusive) {
    return (parsedRangeStart <= val) && (val <= parsedRangeEnd);
  }
  return (parsedRangeStart <= val) && (val < parsedRangeEnd);
}
