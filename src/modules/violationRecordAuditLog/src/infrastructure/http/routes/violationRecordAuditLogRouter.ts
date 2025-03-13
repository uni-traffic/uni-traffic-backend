import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { ViolationRecordAuditLogRequestSchema } from "../../../dtos/violationRecordAuditLogRequestSchema";
import { GetViolationRecordAuditLogController } from "../controller/getViolationRecordAuditLogController";

const violationRecordAuditLogRouter = Router();

violationRecordAuditLogRouter.get(
  "/search",
  validateRequest({ query: ViolationRecordAuditLogRequestSchema }),
  (req: Request, res: Response) => {
    new GetViolationRecordAuditLogController().execute(req, res);
  }
);

export { violationRecordAuditLogRouter };
