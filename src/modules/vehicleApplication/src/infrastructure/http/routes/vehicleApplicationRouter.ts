import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import {
  UpdateVehicleApplicationStatusSchema,
  UpdateVehicleApplicationStickerSchema,
  VehicleApplicationCreateRequestSchema,
  VehicleApplicationRequestSchema
} from "../../../dtos/vehicleApplicationRequestSchema";
import { CreateVehicleApplicationController } from "../controller/createVehicleApplicationController";
import { GetVehicleApplicationController } from "../controller/getVehicleApplicationController";
import { UpdateVehicleApplicationStatusController } from "../controller/updateVehicleApplicationStatusController";
import { UpdateVehicleApplicationStickerController } from "../controller/updateVehicleApplicationStickerController";

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

vehicleApplicationRouter.post(
  "/update/status",
  validateRequest({ body: UpdateVehicleApplicationStatusSchema }),
  (req: Request, res: Response) => {
    new UpdateVehicleApplicationStatusController().execute(req, res);
  }
);

vehicleApplicationRouter.post(
  "/update/sticker",
  validateRequest({ body: UpdateVehicleApplicationStickerSchema }),
  (req: Request, res: Response) => {
    new UpdateVehicleApplicationStickerController().execute(req, res);
  }
);

export { vehicleApplicationRouter };
