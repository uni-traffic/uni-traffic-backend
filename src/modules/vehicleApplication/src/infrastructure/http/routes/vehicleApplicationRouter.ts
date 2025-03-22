import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import {
  VehicleApplicationCreateRequestSchema,
  VehicleApplicationRequestSchema
} from "../../../dtos/vehicleApplicationRequestSchema";
import { CreateVehicleApplicationController } from "../controller/createVehicleApplicationController";
import { GetVehicleApplicationController } from "../controller/getVehicleApplicationController";

const vehicleApplicationRouter = Router();

vehicleApplicationRouter.get(
  "/search",
  validateRequest({ query: VehicleApplicationRequestSchema }),
  (req: Request, res: Response) => {
    new GetVehicleApplicationController().execute(req, res);
  }
);

vehicleApplicationRouter.post(
  "/create",
  validateRequest({ body: VehicleApplicationCreateRequestSchema }),
  (req: Request, res: Response) => {
    new CreateVehicleApplicationController().execute(req, res);
  }
);

export { vehicleApplicationRouter };
