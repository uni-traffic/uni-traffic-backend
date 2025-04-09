import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { AuditLogGetRequestSchema } from "../../../dtos/auditLogRequestSchema";
import { GetAuditLogController } from "../controller/getAuditLogController";

const auditLogRouter = Router();

auditLogRouter.get(
  "/search",
  validateRequest({ query: AuditLogGetRequestSchema }),
  (req: Request, res: Response) => {
    new GetAuditLogController().execute(req, res);
  }
);

export { auditLogRouter };
