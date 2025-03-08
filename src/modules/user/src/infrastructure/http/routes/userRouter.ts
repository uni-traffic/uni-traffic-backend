import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { GetUserRequestSchema, UpdateUserRoleSchema } from "../../../dtos/userRequestSchema";
import { GetUserInformationController } from "../controllers/getUserInformationController";
import { MyProfileController } from "../controllers/myProfileController";
import { UpdateUserRoleController } from "../controllers/updateUserRoleController";

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

export { userRouter };
