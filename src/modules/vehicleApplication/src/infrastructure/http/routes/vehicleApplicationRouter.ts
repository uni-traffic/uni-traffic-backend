import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { VehicleApplicationRequestSchema } from "../../../dtos/vehicleApplicationRequestSchema";
import { GetVehicleApplicationController } from "../controller/getVehicleApplicationController";

const vehicleApplicationRouter = Router();

vehicleApplicationRouter.get(
  "/search",
  validateRequest({ query: VehicleApplicationRequestSchema }),
  (req: Request, res: Response) => {
    new GetVehicleApplicationController().execute(req, res);
  }
);

export { vehicleApplicationRouter };
