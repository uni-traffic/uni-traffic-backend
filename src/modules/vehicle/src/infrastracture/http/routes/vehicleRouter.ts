import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { AuditLogGetRequestSchema } from "../../../../../auditLog/src/dtos/auditLogRequestSchema";
import { VehicleGetRequestSchema } from "../../../dtos/vehicleRequestSchema";
import { GetVehicleController } from "../controllers/getVehicleController";
import { GetVehicleInformationController } from "../controllers/getVehicleInformationController";

const vehicleRouter = Router();

vehicleRouter.get(
  "/",
  validateRequest({ query: VehicleGetRequestSchema }),
  (req: Request, res: Response) => {
    new GetVehicleInformationController().execute(req, res);
  }
);

vehicleRouter.get(
  "/search",
  validateRequest({ query: AuditLogGetRequestSchema }),
  (req: Request, res: Response) => {
    new GetVehicleController().execute(req, res);
  }
);

export { vehicleRouter };
