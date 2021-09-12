export class PublicError extends Error {
  constructor(public override message: string, public statusCode: number = 500) {
    super();
  }
}
