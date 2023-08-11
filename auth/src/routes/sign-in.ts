import express from "express";

const router = express.Router();

router.get("/api/users/signIn", (req, res) => {
  res.send("Hi there!");
});

export { router as sinnInRouter };
