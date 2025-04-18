import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { GetUserSignInActivityByRangeRequest } from "../../dtos/userSignInActivityRequestSchema";
import { CountUserSignInActivityByRangeController } from "../controller/countUserSignInActivityByRangeController";
import { GetTotalUniqueSignInByGivenRangeController } from "../controller/getTotalUniqueSignInByGivenRangeController";

const userSignInActivityRouter = Router();

userSignInActivityRouter.get(
  "/count",
  validateRequest({ query: GetUserSignInActivityByRangeRequest }),
  (req: Request, res: Response) => {
    new CountUserSignInActivityByRangeController().execute(req, res);
  }
);

userSignInActivityRouter.get(
  "/stats/count",
  validateRequest({ query: GetUserSignInActivityByRangeRequest }),
  (req: Request, res: Response) => {
    new GetTotalUniqueSignInByGivenRangeController().execute(req, res);
  }
);

export { userSignInActivityRouter };
