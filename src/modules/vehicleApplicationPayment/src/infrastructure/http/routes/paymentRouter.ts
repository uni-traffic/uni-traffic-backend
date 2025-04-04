import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { VehicleApplicationPaymentRequestSchema } from "../../../dtos/vehicleApplicationPaymentRequestSchema";
import { AddVehicleApplicationPaymentController } from "../controller/addVehicleApplicationPaymentController";

const vehicleApplicationPaymentRouter = Router();

vehicleApplicationPaymentRouter.post(
  "/sticker",
  validateRequest({ body: VehicleApplicationPaymentRequestSchema }),
  (req: Request, res: Response) => {
    new AddVehicleApplicationPaymentController().execute(req, res);
  }
);

export { vehicleApplicationPaymentRouter };
