import { type Request, type Response, Router } from "express";
import multer from "multer";
import { UploadFileController } from "../controllers/uploadFileController";

const fileRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

fileRouter.post("/upload", upload.single("image"), async (req: Request, res: Response) => {
  new UploadFileController().execute(req, res);
});

export { fileRouter };
