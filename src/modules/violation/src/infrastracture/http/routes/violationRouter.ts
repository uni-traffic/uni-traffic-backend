import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import {
  GetViolationRequestSchema,
  UpdateViolationRequestSchema,
  ViolationCreateRequestSchema,
  ViolationDeleteRequestSchema
} from "../../../dtos/violationRequestSchema";
import { CreateViolationController } from "../controllers/createViolationController";
import { DeleteViolationController } from "../controllers/deleteViolationController";
import { GetNonDeletedViolationController } from "../controllers/getNonDeletedViolationController";
import { GetViolationController } from "../controllers/getViolationController";
import { UpdateViolationController } from "../controllers/updateViolationController";

const violationRouter = Router();

violationRouter.get("/", (req, res) => {
  new GetNonDeletedViolationController().execute(req, res);
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

violationRouter.post(
  "/delete",
  validateRequest({ body: ViolationDeleteRequestSchema }),
  (req, res) => {
    new DeleteViolationController().execute(req, res);
  }
);

violationRouter.get(
  "/search",
  validateRequest({ query: GetViolationRequestSchema }),
  (req, res) => {
    new GetViolationController().execute(req, res);
  }
);

export { violationRouter };
