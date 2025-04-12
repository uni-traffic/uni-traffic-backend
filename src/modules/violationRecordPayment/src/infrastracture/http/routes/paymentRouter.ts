import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import {
  ViolationRecordPaymentGetByRangeRequestSchema,
  ViolationRecordPaymentRequestSchema
} from "../../../dtos/violationRecordPaymentRequestSchema";
import { AddViolationRecordPaymentController } from "../controllers/addViolationRecordPaymentController";
import { GetTotalFineCollectedPerDayByRangeController } from "../controllers/getTotalFineCollectedByRangePerDayController";

const paymentRouter = Router();

paymentRouter.post(
  "/violation",
  validateRequest({ body: ViolationRecordPaymentRequestSchema }),
  (req: Request, res: Response) => {
    new AddViolationRecordPaymentController().execute(req, res);
  }
);

paymentRouter.get(
  "/violation/total",
  validateRequest({ query: ViolationRecordPaymentGetByRangeRequestSchema }),
  (req: Request, res: Response) => {
    new GetTotalFineCollectedPerDayByRangeController().execute(req, res);
  }
);
export { paymentRouter };
