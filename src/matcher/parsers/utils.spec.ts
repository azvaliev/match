import { vi } from 'vitest';

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

export {
  setupHandlersAndTestValue,
};
export default {};
