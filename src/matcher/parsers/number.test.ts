import { beforeEach, describe, it } from 'vitest';
import { setupHandlersAndTestValue } from './utils.spec';
import { numberMatcher } from './number';

type GetRandomNumberOptions = {
  low?: number;
  high?: number;
  round?: boolean;
};

function getRandomNumber(partialOptions?: GetRandomNumberOptions): number;
function getRandomNumber(partialOptions = {}) {
  const options: Required<GetRandomNumberOptions> = {
    low: -10000,
    high: 10000,
    round: false,
    ...partialOptions,
  };

  const random = (Math.random() * (options.high - options.low)) + options.low;

  if (options.round) {
    return Math.round(random);
  }
  return random;
}

describe.concurrent('Directly matching number to values', () => {
  const {
    testValue,
    matchHandler,
    defaultHandler,
    beforeEachCleanup,
  } = setupHandlersAndTestValue(getRandomNumber);

  beforeEach(beforeEachCleanup);

  it('number literals', ({ expect }) => {
    numberMatcher(testValue.current, [
      [testValue.current, matchHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchHandler).toHaveBeenCalledOnce();
    expect(matchHandler).toHaveBeenCalledWith(testValue.current);
  });

  it('array of numbers', ({ expect }) => {
    const matchingArray = Array.from({ length: 12 }, () => getRandomNumber());
    matchingArray[getRandomNumber({ low: 0, high: 12, round: true })] = testValue.current;

    numberMatcher(testValue.current, [
      [matchingArray, matchHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchHandler).toHaveBeenCalledOnce();
    expect(matchHandler).toHaveBeenCalledWith(testValue.current);
  });

  it('set of numbers', ({ expect }) => {
    const matchingSet = new Set(Array.from({ length: 14 }, () => getRandomNumber()));
    matchingSet.add(testValue.current);

    numberMatcher(testValue.current, [
      [matchingSet, matchHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchHandler).toHaveBeenCalledOnce();
    expect(matchHandler).toHaveBeenCalledWith(testValue.current);
  });
});

describe('Matching numbers with comparison', () => {
  let x = getRandomNumber({ high: 0 });
  let y = getRandomNumber({ low: 0 });

  const {
    testValue,
    matchHandler,
    defaultHandler,
    beforeEachCleanup,
  } = setupHandlersAndTestValue(
    () => getRandomNumber({ low: x, high: y - 1 }),
  );

  beforeEach(() => {
    x = getRandomNumber({ high: 0 });
    y = getRandomNumber({ low: 0 });
    beforeEachCleanup();
  });

  it('less than Y', ({ expect }) => {
    numberMatcher(testValue.current, [
      [`<${y}`, matchHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchHandler).toHaveBeenCalled();
    expect(matchHandler).toHaveBeenCalledWith(testValue.current);
  });

  it('greater than X', ({ expect }) => {
    numberMatcher(testValue.current, [
      [`>${x}`, matchHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchHandler).toHaveBeenCalled();
    expect(matchHandler).toHaveBeenCalledWith(testValue.current);
  });

  it('between X and Y, non inclusive of Y', ({ expect }) => {
    numberMatcher(testValue.current, [
      [`${x}..${y}`, matchHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchHandler).toHaveBeenCalled();
    expect(matchHandler).toHaveBeenCalledWith(testValue.current);
  });

  it('between X and Y, inclusive of Y', ({ expect }) => {
    numberMatcher(y, [
      [`${x}..=${y}`, matchHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchHandler).toHaveBeenCalled();
    expect(matchHandler).toHaveBeenCalledWith(y);
  });
});
