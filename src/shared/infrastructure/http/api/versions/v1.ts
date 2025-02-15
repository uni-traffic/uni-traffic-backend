import { Router, type Request, type Response } from "express";
import { authRouter } from "../../../../../modules/user/src/infrastructure/http/routes/authRouter";

const v1Router = Router();

v1Router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Uni-traffic Backend API v1" });
});
v1Router.use("/auth", authRouter);

export { v1Router };
