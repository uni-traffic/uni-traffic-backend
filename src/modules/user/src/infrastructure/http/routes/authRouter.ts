import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { GoogleSignInSchema, LoginSchema, RegisterSchema } from "../../../dtos/userRequestSchema";
import { GoogleSignInController } from "../controllers/auth/googleSignInController";
import { LogOutUserController } from "../controllers/auth/logOutUserController";
import { LoginUserController } from "../controllers/auth/loginUserController";
import { RegisterUserController } from "../controllers/auth/registerUserController";

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

authRouter.post(
  "/google",
  validateRequest({ body: GoogleSignInSchema }),
  (req: Request, res: Response) => {
    new GoogleSignInController().execute(req, res);
  }
);

authRouter.post("/logout", (req: Request, res: Response) => {
  new LogOutUserController().execute(req, res);
});

export { authRouter };
