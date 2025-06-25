export class ApiError extends Error {
  statusCode: number;
  state: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.state = statusCode.toString().startsWith("4") ? "fail" : "error";
  }
}
