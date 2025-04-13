import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { GetUserSignInActivityByRangeRequest } from "../../dtos/userSignInActivityRequestSchema";
import { CountUserSignInActivityByRangeController } from "../controller/countUserSignInActivityByRangeController";

const userSignInActivityRouter = Router();

userSignInActivityRouter.get(
  "/count",
  validateRequest({ query: GetUserSignInActivityByRangeRequest }),
  (req: Request, res: Response) => {
    new CountUserSignInActivityByRangeController().execute(req, res);
  }
);

export { userSignInActivityRouter };
