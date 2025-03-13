import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { ViolationRecordPaymentRequestSchema } from "../../../dtos/violationRecordPaymentRequestSchema";
import { AddViolationRecordPaymentController } from "../controllers/addViolationRecordPaymentController";

const violationRecordPaymentRouter = Router();

violationRecordPaymentRouter.post(
  "/violation",
  validateRequest({ body: ViolationRecordPaymentRequestSchema }),
  (req: Request, res: Response) => {
    new AddViolationRecordPaymentController().execute(req, res);
  }
);

export { violationRecordPaymentRouter };
