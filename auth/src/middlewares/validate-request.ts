import { Request, Response, NextFunction } from 'express';
import { Result, ValidationError, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error-request";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  const errors: Result<ValidationError> = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
}
