enum StatusCodes {
  /**
    * The matcher only supports certain types and will throw this error if an unsupported type is passed in
  * */
  UNSUPPORTED_TYPE,
  /**
    * Matcher requires a default case, and if it is missing this error will be thrown
  * */
  MISSING_FALLBACK,
}

class MatchError extends Error {
  static StatusCodes = StatusCodes;
  public status: StatusCodes;

  constructor({ message, status }: { message: string, status: StatusCodes }) {
    super(message);
    this.status = status;
  }
}

export { MatchError };
