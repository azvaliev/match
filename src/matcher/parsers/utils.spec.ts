import { vi } from 'vitest';
import { MatchError } from '../error';

type GetRandomNumberOptions = {
  low: number;
  high: number;
  round: boolean;
};

function getRandomNumber(partialOptions?: Partial<GetRandomNumberOptions>): number;
function getRandomNumber(partialOptions = {}) {
  const options: GetRandomNumberOptions = {
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

type CreateRandomStringOptions = {
  min: number;
  max: number;
};

function getRandomString(partialOptions?: Partial<CreateRandomStringOptions>): string;
function getRandomString(partialOptions = {}) {
  const options: CreateRandomStringOptions = {
    min: 12,
    max: 32,
    ...partialOptions,
  };

  const length = getRandomNumber({ low: options.min, high: options.max, round: true });

  return Array
    .from(
      { length },
      () => String.fromCharCode(
        getRandomNumber({ low: 32, high: 126, round: true }),
      ),
    )
    .join('');
}

function setupHandlersAndTestValue<T>(getTestValue: () => T) {
  const testValue = { current: getTestValue() };
  const matchHandler = vi.fn();
  const defaultHandler = vi.fn();

  return {
    testValue,
    matchHandler,
    defaultHandler,
    beforeEachCleanup: () => {
      testValue.current = getTestValue();
      matchHandler.mockReset();
      defaultHandler.mockReset();
    },
  };
}

function captureMatchErrors() {
  const consoleErrorFn = console.error;

  const error: { current?: MatchError | undefined } = {};
  const mockConsoleError = () => {
    console.error = vi.fn().mockImplementation((err) => {
      if (err instanceof MatchError) {
        error.current = err;
      }
    });
  };

  mockConsoleError();

  return {
    error,
    reMockConsoleError: mockConsoleError,
    resetConsoleError() {
      console.error = consoleErrorFn;
      error.current = undefined;
    },
  };
}

export {
  captureMatchErrors,
  getRandomNumber,
  getRandomString,
  setupHandlersAndTestValue,
};
