import type { Matcher, MatcherDefaultHandler } from './types';
import { MatchError } from './error';

/**
  * Gets default matcher case, or throws
* */
function getDefaultHandler<
  MatchType,
  MatchReturnType,
>(
  matcherOptions: Matcher<MatchType, MatchReturnType>,
): MatcherDefaultHandler<MatchType, MatchReturnType> {
  const defaultCase = matcherOptions?.[matcherOptions.length - 1];
  if (typeof defaultCase !== 'function') {
    throw new MatchError({
      message: 'Missing Default Case',
      status: MatchError.StatusCodes.MISSING_DEFAULT_HANDLER,
    });
  }

  return defaultCase as MatcherDefaultHandler<MatchType, MatchReturnType>;
}

export {
  getDefaultHandler,
};
export default {};
