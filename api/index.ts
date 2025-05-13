import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { v1Router } from "../src/shared/infrastructure/http/api/versions/v1";
import { EnvValidator } from "../src/shared/lib/envValidator";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use("/api/v1", v1Router);
app.get("/", (req, res) => {
  const keyValidator = new EnvValidator();
  const missingKeys = keyValidator.validate();
  if (missingKeys.length > 0) {
    res.status(500).json({
      message: "System configuration is incomplete. Required setup values are missing.",
      code: missingKeys
    });
    return;
  }

  res.status(200).json({ message: "Uni-traffic Backend API" });
});

if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("Server started on port 3000");
  });
}

export default app;
