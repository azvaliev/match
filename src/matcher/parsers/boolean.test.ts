import {
  beforeEach,
  describe,
  it,
} from 'vitest';
import { booleanMatcher } from './boolean';
import { getRandomBoolean, getRandomString, setupHandlersAndTestValue } from './utils.spec';

describe('Directly matching strings to values', () => {
  const {
    testValue,
    matchHandler,
    defaultHandler,
    beforeEachCleanup,
  } = setupHandlersAndTestValue(getRandomBoolean);

  beforeEach(beforeEachCleanup);

  it('all boolean cases', ({ expect }) => {
    booleanMatcher(testValue.current, [
      [true, testValue.current === true ? matchHandler : defaultHandler],
      [false, testValue.current === false ? matchHandler : defaultHandler],
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchHandler).toHaveBeenCalledOnce();
    expect(matchHandler).toHaveBeenCalledWith(testValue.current);
  });

  it('true case with default handler', ({ expect }) => {
    booleanMatcher(true, [
      [true, matchHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchHandler).toHaveBeenCalledOnce();
    expect(matchHandler).toHaveBeenCalledWith(true);
  });

  it('false case with default handler', ({ expect }) => {
    booleanMatcher(false, [
      [false, matchHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchHandler).toHaveBeenCalledOnce();
    expect(matchHandler).toHaveBeenCalledWith(false);
  });
});

describe('Bad input / Error Handling', () => {
  const {
    testValue,
    matchHandler,
    defaultHandler,
    beforeEachCleanup,
  } = setupHandlersAndTestValue(getRandomBoolean);

  beforeEach(beforeEachCleanup);

  it('non boolean value with default', ({ expect }) => {
    const nonBoolTestValue = getRandomString();

    // @ts-expect-error invalid to pass a string to boolean matcher
    booleanMatcher(nonBoolTestValue, [
      [true, matchHandler],
      defaultHandler,
    ]);

    expect(matchHandler).not.toHaveBeenCalled();

    expect(defaultHandler).toHaveBeenCalledOnce();
    expect(defaultHandler).toHaveBeenCalledWith(nonBoolTestValue);
  });

  it('invalid match option', ({ expect }) => {
    booleanMatcher(testValue.current, [
    // @ts-expect-error it is invalid to pass null here
      null,
      defaultHandler,
    ]);

    expect(matchHandler).not.toHaveBeenCalled();

    expect(defaultHandler).toHaveBeenCalledOnce();
    expect(defaultHandler).toHaveBeenCalledWith(testValue.current);
  });
});
