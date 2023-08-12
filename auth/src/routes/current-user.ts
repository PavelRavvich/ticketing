import express, { Request, Response, Router } from "express";
import { currentUser } from "@pravvich-tickets/common";


const router: Router = express.Router();

router.get("/api/users/currentUser", currentUser, (req: Request, res: Response): void => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
