import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { AuditLogGetRequestSchema } from "../../../../../auditLog/src/dtos/auditLogRequestSchema";
import { GetVehicleController } from "../controllers/getVehicleController";

const vehicleRouter = Router();

vehicleRouter.get(
  "/search",
  validateRequest({ query: AuditLogGetRequestSchema }),
  (req: Request, res: Response) => {
    new GetVehicleController().execute(req, res);
  }
);

export { vehicleRouter };
