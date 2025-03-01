import { type Request, type Response, Router } from "express";
import { MyProfileController } from "../controllers/myProfileController";

const userRouter = Router();

userRouter.get("/me", (req: Request, res: Response) => {
  new MyProfileController().execute(req, res);
});

export { userRouter };
