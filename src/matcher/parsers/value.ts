import type { Matcher } from '../types';
import { getDefaultHandler } from '../utils';

function valueMatcher<
  MatchReturnType,
>(val: unknown, matchOptions: Matcher<unknown, MatchReturnType>): MatchReturnType {
  const defaultMatchHandler = getDefaultHandler(matchOptions);

  // Skip last option in for loop
  for (let i = 0; i < matchOptions.length - 1; i += 1) {
    const matchOption = matchOptions[i];

    // Break for default case, either function or no more options
    if (!Array.isArray(matchOption)) {
      break;
    }

    const [matchValue, matchHandler] = matchOption;

    if (matchValue === val) {
      return matchHandler(val);
    }
  }

  return defaultMatchHandler(val);
}

export { valueMatcher };
export default {};
