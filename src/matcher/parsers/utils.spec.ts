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
  /**
    * If false, will only use a-zA-Z
    * @default true
  * */
  allowSpecialCharacters: boolean;
};

function getRandomString(partialOptions?: Partial<CreateRandomStringOptions>): string;
function getRandomString(partialOptions = {}) {
  const { min, max, allowSpecialCharacters }: CreateRandomStringOptions = {
    min: 12,
    max: 32,
    allowSpecialCharacters: true,
    ...partialOptions,
  };

  const length = getRandomNumber({ low: min, high: max, round: true });

  return Array
    .from(
      { length },
      () => {
        let randomCharCode: number;

        // If no special characters, 50% chance for lowercase
        if (!allowSpecialCharacters && Math.random() > 0.5) {
          randomCharCode = getRandomNumber({
            low: 97,
            high: 122,
            round: true,
          });

        // If no special characters, 50% chance for uppercase
        } else if (!allowSpecialCharacters) {
          randomCharCode = getRandomNumber({
            low: 65,
            high: 90,
            round: true,
          });

        // Default include special characters
        } else {
          randomCharCode = getRandomNumber({
            low: 32,
            high: 126,
            round: true,
          });
        }

        return String.fromCharCode(randomCharCode);
      },
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
