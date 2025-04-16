import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { ViolationCreateRequestSchema } from "../../../dtos/violationRequestSchema";
import { CreateViolationController } from "../controllers/createViolationController";
import { GetViolationsController } from "../controllers/getViolationController";

const violationRouter = Router();

violationRouter.get("/", (req, res) => {
  new GetViolationsController().execute(req, res);
});

violationRouter.post(
  "/create",
  validateRequest({ body: ViolationCreateRequestSchema }),
  (req, res) => {
    new CreateViolationController().execute(req, res);
  }
);

export { violationRouter };
