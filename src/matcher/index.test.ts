import {
  beforeEach, describe, it,
} from 'vitest';

import { match } from '.';
import { MatchError } from './error';
import { getRandomNumber, getRandomString, setupHandlersAndTestValue } from './parsers/utils.spec';

describe('Fundamental Behavior', () => {
  const {
    testValue,
    matchHandler,
    defaultHandler,
    beforeEachCleanup,
  } = setupHandlersAndTestValue(getRandomString);

  beforeEach(beforeEachCleanup);

  it('Can execute default catch all', ({ expect }) => {
    match(testValue.current, [defaultHandler]);

    expect(defaultHandler).toHaveBeenCalledOnce();
    expect(defaultHandler).toHaveBeenCalledWith(testValue.current);
  });

  it('Can match literals', ({ expect }) => {
    match(testValue.current, [
      [testValue.current, matchHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchHandler).toHaveBeenCalledOnce();
    expect(matchHandler).toHaveBeenCalledWith(testValue.current);
  });

  it('Executes fallback catch all when no matches', ({ expect }) => {
    match(testValue.current, [
      [getRandomString(), matchHandler],
      defaultHandler,
    ]);

    expect(matchHandler).not.toHaveBeenCalled();

    expect(defaultHandler).toHaveBeenCalledOnce();
    expect(defaultHandler).toHaveBeenCalledWith(testValue.current);
  });

  it('Returns first match', ({ expect }) => {
    match(testValue.current, [
      [getRandomString(), defaultHandler],
      [testValue.current, matchHandler],
      [testValue.current, matchHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchHandler).toHaveBeenCalledOnce();
    expect(matchHandler).toHaveBeenCalledWith(testValue.current);
  });
});

describe('Throws the correct errors with invalid arguments', () => {
  it('UNSUPPORTED_TYPE error when undefined required arguments are passed in', ({ expect }) => {
    let error: MatchError | undefined;

    try {
      // @ts-expect-error intentionally passing invalid arguments
      match();
    } catch (err) {
      if (err instanceof MatchError) {
        error = err;
      }
    }

    expect(error).toBeDefined();
    expect(error?.message).toBeDefined();
    expect(error?.status).toBe(MatchError.StatusCodes.UNSUPPORTED_TYPE);
  });

  const {
    testValue,
    beforeEachCleanup,
  } = setupHandlersAndTestValue(getRandomString);

  beforeEach(beforeEachCleanup);

  it('MISSING_DEFAULT_HANDLER error when no array with default handler is provided', ({ expect }) => {
    let error: MatchError | undefined;

    try {
      // @ts-expect-error intentionally omitting required handler argument
      match(testValue.current);
    } catch (err) {
      if (err instanceof MatchError) {
        error = err;
      }
    }

    expect(error).toBeDefined();
    expect(error?.message).toBeDefined();
    expect(error?.status).toBe(MatchError.StatusCodes.MISSING_DEFAULT_HANDLER);
  });

  it('MISSING_DEFAULT_HANDLER error when empty array with no default handler is provided', ({ expect }) => {
    let error: MatchError | undefined;

    try {
      // @ts-expect-error intentionally omitting required handler argument
      match(testValue.current, []);
    } catch (err) {
      if (err instanceof MatchError) {
        error = err;
      }
    }

    expect(error).toBeDefined();
    expect(error?.message).toBeDefined();
    expect(error?.status).toBe(MatchError.StatusCodes.MISSING_DEFAULT_HANDLER);
  });

  it('MISSING_FALLBACK error when array with invalid default handler is provided', ({ expect }) => {
    let error: MatchError | undefined;

    try {
      // @ts-expect-error intentionally giving wrong type for handler argument
      match(getRandomNumber(), [{}]);
    } catch (err) {
      if (err instanceof MatchError) {
        error = err;
      }
    }

    expect(error).toBeDefined();
    expect(error?.message).toBeDefined();
    expect(error?.status).toBe(MatchError.StatusCodes.MISSING_DEFAULT_HANDLER);
  });
});
