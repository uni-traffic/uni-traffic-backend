import { type Request, type Response, Router } from "express";
import { MyProfileController } from "../controllers/myProfileController";
import { validateRequest } from "zod-express-middleware";
import { GetUserRequestSchema } from "../../../dtos/userRequestSchema";
import { GetUserInformationController } from "../controllers/getUserInformationController";

const userRouter = Router();

userRouter.get("/me", (req: Request, res: Response) => {
  new MyProfileController().execute(req, res);
});

userRouter.get(
  "/search",
  validateRequest({ query: GetUserRequestSchema }),
  (req: Request, res: Response) => {
    new GetUserInformationController().execute(req, res);
  }
);
export { userRouter };
