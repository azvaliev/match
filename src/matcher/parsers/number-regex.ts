const rangematcher = /(?<rangestart>\d*)\.\.(?<inclusive>=?)(?<rangeend>\d*)/;

/**
  * @deprecated this regex implementation seems slower
  *
  * Parse a string like '>60' | '<120' | '20..45' | '80..=20'
  * into a comparison or range
  * */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseAndEvaluateNumberComparison(matcher: string, val: number): boolean {
  if (matcher.charAt(0) === '>') {
    return val > parseFloat(matcher.slice(1));
  }
  if (matcher.charAt(0) === '<') {
    return val < parseFloat(matcher.slice(1));
  }

  const regexResult = matcher.match(rangematcher);
  if (!regexResult) {
    throw new Error(`Invalid matcher expression '${matcher}'`);
  }

  const [fullMatch, rawRangeStart, inclusiveMatch, rawRangeEnd] = regexResult;

  const inclusive = !!inclusiveMatch;
  const rangeStart = parseFloat(rawRangeStart ?? '');

  if (Number.isNaN(rangeStart)) {
    throw new Error(`Failed to parse start of range '${fullMatch}'`);
  }

  const rangeEnd = parseFloat(rawRangeEnd ?? '');

  if (Number.isNaN(rangeEnd)) {
    throw new Error(`Failed to parse end of range '${fullMatch}'`);
  }

  if (inclusive) {
    return (rangeStart <= val) && (val <= rangeEnd);
  }
  return (rangeEnd <= val) && (val < rangeEnd);
}
