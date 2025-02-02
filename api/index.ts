import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { v1Router } from "@/shared/infrastructure/http/api/versions/v1";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/v1', v1Router);
app.get("/", (req, res) => {
  res.status(200).json({ message: 'Uni-traffic Backend API' });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("Server started on port 3000");
  });
}

export default app;