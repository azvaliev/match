import { describe, it, vi } from 'vitest';

import { match } from '.';
import { MatchError } from './error';

describe.concurrent('Executes the correct matcher type', () => {
  it('Default catch all for strings', ({ expect }) => {
    const testString = 'hello world';

    const defaultHandler = vi.fn();
    match(testString, [defaultHandler]);

    expect(defaultHandler).toHaveBeenCalledOnce();
    expect(defaultHandler).toHaveBeenCalledWith(testString);
  });

  it('Default catch all for numbers', ({ expect }) => {
    const testNumber = 45;

    const defaultHandler = vi.fn();

    match(testNumber, [defaultHandler]);

    expect(defaultHandler).toHaveBeenCalledOnce();
    expect(defaultHandler).toHaveBeenCalledWith(testNumber);
  });

  it('Can match strings', ({ expect }) => {
    const testString = 'bar bazz';

    const matchSuccessHandler = vi.fn();
    const defaultHandler = vi.fn();

    match(testString, [
      [testString, matchSuccessHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchSuccessHandler).toHaveBeenCalledOnce();
    expect(matchSuccessHandler).toHaveBeenCalledWith(testString);
  });

  it('Can match numbers', ({ expect }) => {
    const testNumber = 45;

    const matchSuccessHandler = vi.fn();
    const defaultHandler = vi.fn();

    match(testNumber, [
      [testNumber, matchSuccessHandler],
      defaultHandler,
    ]);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(matchSuccessHandler).toHaveBeenCalledOnce();
    expect(matchSuccessHandler).toHaveBeenCalledWith(testNumber);
  });
});

describe.concurrent('Throws the correct errors with invalid arguments', () => {
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

  it('MISSING_FALLBACK error when no array with default handler is provided', ({ expect }) => {
    let error: MatchError | undefined;

    try {
      // @ts-expect-error intentionally omitting required handler argument
      match('TEST STRING');
    } catch (err) {
      if (err instanceof MatchError) {
        error = err;
      }
    }

    expect(error).toBeDefined();
    expect(error?.message).toBeDefined();
    expect(error?.status).toBe(MatchError.StatusCodes.MISSING_FALLBACK);
  });

  it('MISSING_FALLBACK error when empty array with no default handler is provided', ({ expect }) => {
    let error: MatchError | undefined;

    try {
      // @ts-expect-error intentionally omitting required handler argument
      match('TEST STRING', []);
    } catch (err) {
      if (err instanceof MatchError) {
        error = err;
      }
    }

    expect(error).toBeDefined();
    expect(error?.message).toBeDefined();
    expect(error?.status).toBe(MatchError.StatusCodes.MISSING_FALLBACK);
  });

  it('MISSING_FALLBACK error when array with invalid default handler is provided', ({ expect }) => {
    let error: MatchError | undefined;

    try {
      // @ts-expect-error intentionally giving wrong type for handler argument
      match(69, [{}]);
    } catch (err) {
      if (err instanceof MatchError) {
        error = err;
      }
    }

    expect(error).toBeDefined();
    expect(error?.message).toBeDefined();
    expect(error?.status).toBe(MatchError.StatusCodes.MISSING_FALLBACK);
  });
});
