import type { Matcher, MatcherDefaultHandler } from './types';
import { MatchError } from './error';

/**
  * Gets default matcher case, or throws
* */
function getDefaultHandler<T>(matcherOptions: Matcher<T>): MatcherDefaultHandler<T> {
  const defaultCase = matcherOptions?.[matcherOptions.length - 1];
  if (typeof defaultCase !== 'function') {
    throw new MatchError({
      message: 'Missing Default Case',
      status: MatchError.StatusCodes.MISSING_DEFAULT_HANDLER,
    });
  }

  return defaultCase;
}

export {
  getDefaultHandler,
};
export default {};
