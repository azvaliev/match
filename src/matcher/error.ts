enum StatusCodes {
  /**
    * The matcher only supports certain types,
    * will throw this error if an unsupported type is provided
  * */
  UNSUPPORTED_TYPE,
  /**
    * Matcher requires a default case, and if it is missing this error will be thrown
  * */
  MISSING_DEFAULT_HANDLER,
  /**
    * Recieved a malformed/invalid matcher (ex: '<>600' for a number matcher)
  * */
  BAD_MATCHER,
}

class MatchError extends Error {
  static StatusCodes = StatusCodes;

  public status: StatusCodes;

  constructor({ message, status }: { message: string, status: StatusCodes }) {
    super(message);
    this.status = status;
    this.name = 'MatchError';
  }
}

export { MatchError, StatusCodes };
