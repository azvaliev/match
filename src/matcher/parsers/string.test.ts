import {
  beforeEach,
  describe,
  it,
} from 'vitest';
import {
  getRandomNumber,
  getRandomString,
  setupHandlersAndTestValue,
} from './utils.spec';
import { stringMatcher } from './string';

describe('Directly matching strings to values', () => {
  const {
    testValue,
    matchHandler,
    defaultHandler,
    beforeEachCleanup,
  } = setupHandlersAndTestValue(getRandomString);

  beforeEach(beforeEachCleanup);

  it('string literals', ({ expect }) => {
    stringMatcher(testValue.current, [
      [getRandomString(), defaultHandler],
      [testValue.current, matchHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchHandler).toHaveBeenCalledOnce();
    expect(matchHandler).toHaveBeenCalledWith(testValue.current);
  });

  it('array of strings', ({ expect }) => {
    const testArray = Array.from(
      { length: getRandomNumber({ low: 16, high: 42, round: true }) },
      () => getRandomString(),
    );
    testArray[
      getRandomNumber({ low: 0, high: testArray.length - 1, round: true })
    ] = testValue.current;

    stringMatcher(testValue.current, [
      [getRandomString(), defaultHandler],
      [testArray, matchHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchHandler).toHaveBeenCalledOnce();
    expect(matchHandler).toHaveBeenCalledWith(testValue.current);
  });

  it('set of strings', ({ expect }) => {
    const testSet = new Set(
      Array.from(
        { length: getRandomNumber({ low: 16, high: 42, round: true }) },
        () => getRandomString(),
      ),
    );
    testSet.add(testValue.current);

    stringMatcher(testValue.current, [
      [getRandomString(), defaultHandler],
      [testSet, matchHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchHandler).toHaveBeenCalledOnce();
    expect(matchHandler).toHaveBeenCalledWith(testValue.current);
  });
});

describe('Matching strings using Regular Expressions', () => {
  const {
    testValue,
    matchHandler,
    defaultHandler,
    beforeEachCleanup,
  } = setupHandlersAndTestValue(getRandomString);

  beforeEach(beforeEachCleanup);

  it('catch all', ({ expect }) => {
    stringMatcher(testValue.current, [
      [/.*/, matchHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchHandler).toHaveBeenCalledOnce();
    expect(matchHandler).toHaveBeenCalledWith(testValue.current);
  });

  it('full string even with capture groups', ({ expect }) => {
    const padLength = getRandomNumber({ low: 0, round: true });
    const paddedTestValue = (
      getRandomString({ min: padLength, max: padLength })
      + testValue.current
      + getRandomString({ min: padLength, max: padLength })
    );

    const matchTestValueWithPadding = new RegExp(
      `.{${padLength}}(.{${testValue.current.length}}).{${padLength}}`,
    );

    stringMatcher(paddedTestValue, [
      [matchTestValueWithPadding, matchHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchHandler).toHaveBeenCalledOnce();
    expect(matchHandler).toHaveBeenCalledWith(paddedTestValue);
  });

  it('ignore case flag (i)', ({ expect }) => {
    // use non special characters for this one
    testValue.current = getRandomString({ allowSpecialCharacters: false }).toLowerCase();

    stringMatcher(testValue.current.toUpperCase(), [
      [new RegExp(testValue.current, 'i'), matchHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchHandler).toHaveBeenCalledOnce();
    expect(matchHandler).toHaveBeenCalledWith(testValue.current.toUpperCase());
  });

  it('dotall flag (s)', ({ expect }) => {
    const testValueWithNewLine = testValue
      .current
      .split('')
      .map((c, idx) => (idx === Math.round(testValue.current.length / 2) ? '\n' : c))
      .join('');

    testValue.current = testValueWithNewLine;

    expect(testValue.current).toContain('\n');

    stringMatcher(testValue.current, [
      [/.*/s, matchHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchHandler).toHaveBeenCalledOnce();
    expect(matchHandler).toHaveBeenCalledWith(testValue.current);
  });
});
