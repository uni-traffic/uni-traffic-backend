import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { GetUserRequestSchema, UpdateUserRoleSchema } from "../../../dtos/userRequestSchema";
import { GetTotalUserCountRequestSchema } from "../../../dtos/getTotalUserCountSchema";
import { GetUserInformationController } from "../controllers/user/getUserInformationController";
import { GetTotalUserCountController } from "../controllers/user/getTotalUserCountController";
import { MyProfileController } from "../controllers/user/myProfileController";
import { UpdateUserRoleController } from "../controllers/user/updateUserRoleController";

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

userRouter.post(
  "/update/role",
  validateRequest({ body: UpdateUserRoleSchema }),
  (req: Request, res: Response) => {
    new UpdateUserRoleController().execute(req, res);
  }
);

userRouter.get(
  "/count",
  validateRequest({ query: GetTotalUserCountRequestSchema }),  
  async (req: Request, res: Response) => {
    new GetTotalUserCountController().execute(req, res);
  }
);

export { userRouter };
