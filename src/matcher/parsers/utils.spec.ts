import { vi } from 'vitest';
import { MatchError } from '../error';

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
  setupHandlersAndTestValue,
};
