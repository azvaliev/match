import { Matcher } from '@app/matcher';
import { getDefaultHandler } from '../utils';

function booleanMatcher<
  MatchReturnType,
>(val: boolean, matchOptions: Matcher<boolean, MatchReturnType>): MatchReturnType {
  // Skip last option in for loop
  for (let i = 0; i < matchOptions.length; i += 1) {
    const matchOption = matchOptions[i];

    // Break for default case, either function or no more options
    if (!Array.isArray(matchOption)) {
      break;
    }

    if (val === true && matchOption[0] === true) {
      return matchOption[1](val);
    }
    if (val === false && matchOption[0] === false) {
      return matchOption[1](val);
    }
  }

  return getDefaultHandler<boolean, MatchReturnType>(matchOptions)(val);
}

export { booleanMatcher };
export default {};
