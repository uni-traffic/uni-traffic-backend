import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import {
  ViolationRecordCreateSchema,
  ViolationRecordRequestSchema
} from "../../../dtos/violationRecordRequestSchema";
import { CreateViolationRecordController } from "../controllers/createViolationRecordController";
import { GetViolationRecordController } from "../controllers/getViolationRecordInformationController";

const violationRecordRouter = Router();

violationRecordRouter.post(
  "/create",
  validateRequest({ body: ViolationRecordCreateSchema }),
  (req: Request, res: Response) => {
    new CreateViolationRecordController().execute(req, res);
  }
);

violationRecordRouter.get(
  "/search",
  validateRequest({ query: ViolationRecordRequestSchema }),
  (req: Request, res: Response) => {
    new GetViolationRecordController().execute(req, res);
  }
);

export { violationRecordRouter };
