import { type Request, type Response, Router } from "express";
import { GetViolationsController } from "../controllers/getViolationController";

const violationRouter = Router();

violationRouter.get("/", (req: Request, res: Response) => {
  new GetViolationsController().execute(req, res);
});

export { violationRouter };
