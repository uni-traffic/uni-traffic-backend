import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { VehicleGetRequestSchema } from "../../../dtos/vehicleRequestSchema";
import { GetVehicleInformationController } from "../controllers/getVehicleInformationController";

const vehicleRouter = Router();

vehicleRouter.get(
  "/",
  validateRequest({ query: VehicleGetRequestSchema }),
  (req: Request, res: Response) => {
    new GetVehicleInformationController().execute(req, res);
  }
);

export { vehicleRouter };
