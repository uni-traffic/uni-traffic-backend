import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import {
  GetTotalViolationGivenByGivenRangeRequest,
  GetViolationsGivenPerDayByRangeRequest,
  ViolationRecordCreateSchema,
  ViolationRecordRequestSchema
} from "../../../dtos/violationRecordRequestSchema";
import { CreateViolationRecordController } from "../controllers/createViolationRecordController";
import { GetTotalViolationGivenByRangeController } from "../controllers/getTotalViolationGivenByRangeController";
import { GetTotalViolationGivenController } from "../controllers/getTotalViolationGivenController";
import { GetUnpaidAndPaidViolationTotalController } from "../controllers/getUnpaidAndPaidViolationTotalController";
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

violationRecordRouter.get(
  "/count",
  validateRequest({ query: GetViolationsGivenPerDayByRangeRequest }),
  (req: Request, res: Response) => {
    new GetTotalViolationGivenController().execute(req, res);
  }
);

violationRecordRouter.get("/stats/totals", (req: Request, res: Response) => {
  new GetUnpaidAndPaidViolationTotalController().execute(req, res);
});

violationRecordRouter.get(
  "/stats/violations-given",
  validateRequest({ query: GetTotalViolationGivenByGivenRangeRequest }),
  (req: Request, res: Response) => {
    new GetTotalViolationGivenByRangeController().execute(req, res);
  }
);

export { violationRecordRouter };
