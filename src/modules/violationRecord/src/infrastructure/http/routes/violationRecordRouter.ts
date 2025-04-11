import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import {
  ViolationRecordCreateSchema,
  ViolationRecordRequestSchema,
  TotalViolationSchema
} from "../../../dtos/violationRecordRequestSchema";
import { CreateViolationRecordController } from "../controllers/createViolationRecordController";
import { GetViolationRecordController } from "../controllers/getViolationRecordInformationController";
import { GetTotalViolationGivenController } from "../controllers/getTotalViolationGivenController";

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

violationRecordRouter.get(
  "/count",
  validateRequest({ query: TotalViolationSchema }),
  (req: Request, res: Response) => {
    new GetTotalViolationGivenController().execute(req, res); 
  }
);

export { violationRecordRouter };
