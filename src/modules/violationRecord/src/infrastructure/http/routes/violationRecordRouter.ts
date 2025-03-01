import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { ViolationRecordSchema } from "../../../dtos/violationRecordRequestSchema";
import { CreateViolationRecordController } from "../controllers/createViolationRecordController";

const violationRecordRouter = Router();

violationRecordRouter.post(
  "/create",
  validateRequest({ body: ViolationRecordSchema }),
  (req: Request, res: Response) => {
    new CreateViolationRecordController().execute(req, res);
  }
);

export { violationRecordRouter };
