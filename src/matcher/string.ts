import type { Matcher } from '.';
import { MatchError } from './error';

function stringMatcher(val: string, options: Matcher<string>) {
  const defaultCase = options[options.length - 1];
  if (typeof defaultCase !== 'function') {
    throw new MatchError({
      message: 'Missing string matcher default case',
      status: MatchError.StatusCodes.MISSING_FALLBACK,
    });
  }

  // Skip last option in for loop
  for (let i = 0; i < options.length - 2; i += 1) {
    const option = options[i];

    // Break for default case, either function or no more options
    if (!Array.isArray(option)) {
      break;
    }

    const [matcher, callback] = option;

    if (typeof matcher === 'object') {
      // Array<string>
      if (Array.isArray(matcher)) {
        if (matcher.includes(val)) {
          return callback(val);
        }
      // Set<string>
      } else if (matcher instanceof Set) {
        if (matcher.has(val)) {
          return callback(val);
        }
      // RegExp
      } else if (matcher instanceof RegExp) {
        const [match] = val.match(matcher) ?? [];
        if (match) {
          return callback(match);
        }
      }
    // string
    } else if (matcher === val) {
      return callback(val);
    }
  }

  return defaultCase(val);
}

export default stringMatcher;
