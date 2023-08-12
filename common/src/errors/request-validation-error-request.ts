import { ValidationError } from 'express-validator';
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode: number = 400;

  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): ({ message: any, field: string } | { message: any, field?: undefined })[] {
    return this.errors.map(err => {
      if (err.type === 'field') {
        return { message: err.msg, field: err.path };
      } else {
        return { message: err.msg };
      }
    });
  }
}
