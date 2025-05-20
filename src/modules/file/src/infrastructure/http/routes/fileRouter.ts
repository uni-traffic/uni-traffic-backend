import { type Request, type Response, Router } from "express";
import multer from "multer";
import { DeleteTempFolderController } from "../controllers/deleteTempFolderController";
import { GetSignedUrlController } from "../controllers/getSignedUrlController";
import { UploadFileController } from "../controllers/uploadFileController";

const fileRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

fileRouter.post("/upload", upload.single("image"), async (req: Request, res: Response) => {
  new UploadFileController().execute(req, res);
});

fileRouter.post("/delete", (req: Request, res: Response) => {
  new DeleteTempFolderController().execute(req, res);
});

fileRouter.get("/view", (req: Request, res: Response) => {
  new GetSignedUrlController().execute(req, res);
});

export { fileRouter };
