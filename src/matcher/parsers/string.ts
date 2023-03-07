import type { Matcher } from '@app/matcher';
import { getDefaultHandler } from '@app/matcher/utils';

function stringMatcher<
  MatchReturnType,
>(val: string, matchOptions: Matcher<string, MatchReturnType>): MatchReturnType {
  const defaultMatchHandler = getDefaultHandler<string>(matchOptions);

  // Skip last option in for loop
  for (let i = 0; i < matchOptions.length - 1; i += 1) {
    const matchOption = matchOptions[i];

    // Break for default case, either function or no more options
    if (!Array.isArray(matchOption)) {
      break;
    }

    const [pattern, matchHandler] = matchOption;

    if (typeof pattern === 'object') {
      // Array<string>
      if (Array.isArray(pattern)) {
        if (pattern.includes(val)) {
          return matchHandler(val);
        }

      // Set<string>
      } else if (pattern instanceof Set) {
        if (pattern.has(val)) {
          return matchHandler(val);
        }

      // RegExp
      } else if (pattern instanceof RegExp) {
        const [match] = val.match(pattern) ?? [];
        if (match) {
          return matchHandler(match);
        }
      }
    // string
    } else if (pattern === val) {
      return matchHandler(val);
    }
  }

  return defaultMatchHandler(val);
}

export { stringMatcher };
export default stringMatcher;
