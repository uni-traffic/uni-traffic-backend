import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { LoginSchema, RegisterSchema } from "../../../dtos/userRequestSchema";
import { LoginUserController } from "../controllers/loginUserController";
import { RegisterUserController } from "../controllers/registerUserController";

/**
 * ROUTE: /api/v1/auth
 */
const authRouter = Router();

authRouter.post("/login", validateRequest({ body: LoginSchema }), (req: Request, res: Response) => {
  new LoginUserController().execute(req, res);
});

authRouter.post(
  "/register",
  validateRequest({ body: RegisterSchema }),
  (req: Request, res: Response) => {
    new RegisterUserController().execute(req, res);
  }
);

export { authRouter };
