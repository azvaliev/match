import { match } from 'matcher';

export default match;
export { match as matcher } from 'matcher';
export type {
  Matcher,
  Maybe,
  MatchGreaterThanNum,
  MatchLessThanNum,
  MatchRangeNum,
  MatchIncRangeNum,
} from 'matcher';

export {
  MatchError,
} from 'matcher/error';
