import type { Matcher } from '../types';
import { getDefaultHandler } from '../utils';

function nullUndefinedMatcher<
  MatchReturnType,
>(
  value: null | undefined,
  matchOptions: Matcher<null | undefined, MatchReturnType>,
): MatchReturnType {
  const defaultHandler = getDefaultHandler<typeof value, MatchReturnType>(matchOptions);

  for (let i = 0; i < matchOptions.length; i += 1) {
    const matchOption = matchOptions[i];
    if (!Array.isArray(matchOption)) {
      break;
    }

    const [pattern, matchHandler] = matchOption;
    if (pattern === value) {
      return matchHandler(value);
    }
  }

  return defaultHandler(value);
}

export default nullUndefinedMatcher;
