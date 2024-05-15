export class PublicError extends Error {
  constructor(
    public override message: string,
    public statusCode = 500,
  ) {
    super();
  }
}
