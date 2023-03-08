import { describe, it } from 'vitest';
import { MatchError, StatusCodes } from './error';
import { getRandomString } from './parsers/utils.spec';

describe('Match Errors', () => {
  it('Can create a match error instance', ({ expect }) => {
    const message = getRandomString();
    const status = StatusCodes.BAD_MATCHER;

    const testError = new MatchError({ message, status });

    expect(testError).toBeDefined();
    expect(testError instanceof MatchError).toBe(true);
    expect(testError instanceof Error).toBe(true);

    expect(testError.message).toBe(message);
    expect(testError.status).toBe(status);
    expect(testError.stack).toBeDefined();
    expect(testError.name).toBe('MatchError');
  });

  it('can throw and catch a match error with it\'s data', ({ expect }) => {
    const message = getRandomString();
    const status = StatusCodes.UNSUPPORTED_TYPE;

    let error: MatchError | undefined;

    try {
      throw new MatchError({ message, status });
    } catch (err) {
      expect(err instanceof MatchError).toBe(true);
      expect(err instanceof Error).toBe(true);

      if (err instanceof MatchError) {
        error = err;
      }
    }

    expect(error).toBeDefined();
    expect(error instanceof MatchError).toBe(true);
    expect(error instanceof Error).toBe(true);

    expect(error?.message).toBe(message);
    expect(error?.status).toBe(status);
    expect(error?.stack).toBeDefined();
    expect(error?.name).toBe('MatchError');
  });
});
