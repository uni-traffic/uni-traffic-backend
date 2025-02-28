import { type Request, type Response, Router } from "express";
import { CreateViolationRecordController } from "../controllers/createViolationRecordController";

const violationRecordRouter = Router();

violationRecordRouter.post("/", (req: Request, res: Response) => {
    new CreateViolationRecordController().execute(req, res);
});

export { violationRecordRouter };