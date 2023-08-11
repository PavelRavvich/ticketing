import express, { Request, Response, Router } from "express";
import { body } from "express-validator";

import { validateRequest } from "../middlewares/validate-request";


const router: Router = express.Router();

router.post(
  "/api/users/signIn",
  [
    body("email")
      .isEmail()
      .withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body;

    res.send({email, password});
  });

export { router as signInRouter };
