import type { Matcher } from '.';

function numberMatcher(val: number, options: Matcher<number>) {
  const defaultCase = options[options.length - 1];
  if (typeof defaultCase !== 'function') {
    throw new Error('Missing Fallback Option');
  }

  return defaultCase(val);
}

export default numberMatcher;
