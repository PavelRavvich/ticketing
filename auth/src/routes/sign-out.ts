import express, { Request, Response, Router } from "express";


const router: Router = express.Router();

router.post("/api/users/signOut", (req: Request, res: Response): void => {
  req.session = null;
  res.send({});
});

export { router as signOutRouter };
