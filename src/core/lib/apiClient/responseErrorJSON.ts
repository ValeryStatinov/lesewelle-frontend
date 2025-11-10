export class ResponseErrorJSON extends Error {
  public code: number;

  public constructor(message: string, code: number) {
    super(message);
    this.name = 'ResponseErrorJSON';
    this.code = code;
  }
}
