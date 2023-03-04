import type { Matcher, MatchNumberComparison } from '.';
import { MatchError } from './error';

function numberMatcher(val: number, options: Matcher<number>) {
  const defaultCase = options[options.length - 1];
  if (typeof defaultCase !== 'function') {
    throw new Error('Missing Fallback Option');
  }

  for (let i = 0; i < options.length; i += 1) {
    const option = options[i];
    if (!Array.isArray(option)) {
      break;
    }

    const [matcher, callback] = option;

    // number
    if (typeof matcher === 'number') {
      if (matcher === val) {
        return callback(val);
      }
    } else if (typeof matcher === 'object') {
      // number[]
      if (Array.isArray(matcher)) {
        if (matcher.includes(val)) {
          return callback(val);
        }
      // Set<number>
      } else if (matcher instanceof Set) {
        if (matcher.has(val)) {
          return callback(val);
        }
      }
    } else {
      const matched = parseAndEvaluateNumberComparison(matcher, val);

      if (matched) {
        callback(val);
      }
    }
  }

  return defaultCase(val);
}

export default numberMatcher;

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
