import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import {
  UpdateViolationRequestSchema,
  ViolationCreateRequestSchema
} from "../../../dtos/violationRequestSchema";
import { CreateViolationController } from "../controllers/createViolationController";
import { GetViolationsController } from "../controllers/getViolationController";
import { UpdateViolationController } from "../controllers/updateViolationController";

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

violationRouter.post(
  "/update",
  validateRequest({ body: UpdateViolationRequestSchema }),
  (req, res) => {
    new UpdateViolationController().execute(req, res);
  }
);

export { violationRouter };
