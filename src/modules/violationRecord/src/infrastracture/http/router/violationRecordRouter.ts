import { type Request, type Response, Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { ViolationRecordRequestSchema } from "../../../dtos/violationRecordRequestSchema";
import { GetViolationRecordController } from "../controller/getViolationRecordInformationController";

const violationRecordRouter = Router();

violationRecordRouter.get(
  "/",
  validateRequest({ query: ViolationRecordRequestSchema }),
  (req: Request, res: Response) => {
    new GetViolationRecordController().execute(req, res);
  }
);

export { violationRecordRouter };
