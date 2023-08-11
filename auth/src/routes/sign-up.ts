import express, { Request, Response } from "express";
import { body, Result, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error-request";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { ValidationError } from "express-validator/src/base";

const router = express.Router();

router.post(
  "/api/users/signUp", [
    body("email")
      .isEmail()
      .withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be between 8 and 20 characters")
  ],
  (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    throw new DatabaseConnectionError();
    res.send({});
  });

export { router as sinnUpRouter };
