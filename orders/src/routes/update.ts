import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

router.put("/api/orders/:id", async (req: Request, res: Response) => {
  res.send({});
});

export { router as updateOrderRouter };
