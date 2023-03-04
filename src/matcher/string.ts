import type { Matcher } from '.';

function stringMatcher(val: string, options: Matcher<string>) {
  const defaultCase = options[options.length - 1];
  if (typeof defaultCase !== 'function') {
    throw new Error('Missing Fallback Option');
  }

  // Skip last option in for loop
  for (let i = 0; i < options.length - 2; i += 1) {
    const option = options[i];

    // Break for default case, either function or no more options
    if (typeof option === 'function' || option === undefined) {
      break;
    }

    const [matcher, callback] = option;

    // Regular Expression Matcher
    if (matcher instanceof RegExp) {
      const [match] = val.match(matcher) ?? [];
      if (match) {
        return callback(match);
      }
    // String Comparison
    } else if (matcher === val) {
      return callback(val);
    }
  }

  return defaultCase(val);
}

export default stringMatcher;
