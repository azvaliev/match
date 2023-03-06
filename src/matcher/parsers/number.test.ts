import {
  afterEach,
  beforeEach,
  describe,
  it,
} from 'vitest';
import { captureMatchErrors, getRandomNumber, setupHandlersAndTestValue } from './utils.spec';
import { numberMatcher } from './number';
import { MatchError } from '../error';

describe('Directly matching number to values', () => {
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

describe('Bad input / Error Handling', () => {
  const {
    testValue,
    matchHandler,
    defaultHandler,
    beforeEachCleanup,
  } = setupHandlersAndTestValue(getRandomNumber);

  beforeEach(beforeEachCleanup);

  it('NaN', ({ expect }) => {
    const x = getRandomNumber({ low: testValue.current });
    const y = getRandomNumber({ high: testValue.current });

    numberMatcher(NaN, [
      [`>${x}`, defaultHandler],
      [`<${y}`, defaultHandler],
      [`${y}..=${y + 30}`, defaultHandler],
      [`${x - 40}..${x}`, defaultHandler],
      [NaN, matchHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchHandler).toHaveBeenCalledOnce();
    expect(matchHandler).toHaveBeenCalledWith(NaN);
  });

  const { error, resetConsoleError, reMockConsoleError } = captureMatchErrors();

  afterEach(() => {
    resetConsoleError();
    reMockConsoleError();
  });

  it('invalid match option', ({ expect }) => {
    // @ts-expect-error it is invalid to pass null here
    numberMatcher(testValue.current, [
      null,
      defaultHandler,
    ]);

    expect(defaultHandler).toHaveBeenCalled();
    expect(defaultHandler).toHaveBeenCalledWith(testValue.current);
  });

  it('range string with no numbers', ({ expect }) => {
    // @ts-expect-error non number range string
    numberMatcher(testValue.current, [
      ['%fh', matchHandler],
      defaultHandler,
    ]);

    expect(matchHandler).not.toHaveBeenCalled();

    expect(defaultHandler).toHaveBeenCalledOnce();
    expect(defaultHandler).toBeCalledWith(testValue.current);

    expect(console.error).toHaveBeenCalledOnce();
    expect(error?.current?.status).toBe(MatchError.StatusCodes.BAD_MATCHER);
  });

  it('range string starting with NaN', ({ expect }) => {
    const [x, y] = [getRandomNumber({ low: 1, high: 9, round: true }), getRandomNumber()];

    // @ts-expect-error range string starting with non-number
    numberMatcher(testValue.current, [
      [`J${x}V..${y}`, matchHandler],
      defaultHandler,
    ]);

    expect(matchHandler).not.toHaveBeenCalled();

    expect(defaultHandler).toHaveBeenCalledOnce();
    expect(defaultHandler).toHaveBeenCalledWith(testValue.current);

    expect(console.error).toHaveBeenCalledOnce();
    expect(error?.current?.status).toBe(MatchError.StatusCodes.BAD_MATCHER);
  });

  it('range string missing ..', ({ expect }) => {
    const x = getRandomNumber({ high: testValue.current });

    // @ts-expect-error missing ..
    numberMatcher(testValue.current, [
      [`${x}${testValue.current + 20}`, matchHandler],
      defaultHandler,
    ]);

    expect(matchHandler).not.toHaveBeenCalled();

    expect(defaultHandler).toHaveBeenCalledOnce();
    expect(defaultHandler).toHaveBeenCalledWith(testValue.current);

    expect(console.error).toHaveBeenCalledOnce();
    expect(error?.current?.status).toBe(MatchError.StatusCodes.BAD_MATCHER);
  });

  it('range string ending with NaN', ({ expect }) => {
    const x = getRandomNumber({ high: testValue.current });

    // @ts-expect-error characters after .. is not valid number
    numberMatcher(testValue.current, [
      [`${x}..=h8%E4`, matchHandler],
      defaultHandler,
    ]);

    expect(matchHandler).not.toHaveBeenCalled();

    expect(defaultHandler).toHaveBeenCalledOnce();
    expect(defaultHandler).toHaveBeenCalledWith(testValue.current);

    expect(console.error).toHaveBeenCalledOnce();
    expect(error?.current?.status).toBe(MatchError.StatusCodes.BAD_MATCHER);
  });
});
