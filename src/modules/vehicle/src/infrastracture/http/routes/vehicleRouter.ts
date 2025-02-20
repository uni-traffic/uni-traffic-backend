import { Router, type Request, type Response } from "express";
import { validateRequest } from "zod-express-middleware";
import { VehicleIdSchema } from "../../../dtos/vehicleIdSchema";
import { GetVehicleInformationController } from "../controllers/getVehicleInformationController";

const vehicleRouter = Router();

vehicleRouter.get(
  "/:vehicleId",
  validateRequest({ params: VehicleIdSchema }),
  (req: Request, res: Response) => {
    new GetVehicleInformationController().execute(req, res);
  }
);

export { vehicleRouter };
