import { type Request, type Response, Router } from "express";
import { authRouter } from "../../../../../modules/user/src/infrastructure/http/routes/authRouter";
import { userRouter } from "../../../../../modules/user/src/infrastructure/http/routes/userRouter";
import { vehicleRouter } from "../../../../../modules/vehicle/src/infrastracture/http/routes/vehicleRouter";
import { violationRouter } from "../../../../../modules/violation/src/infrastracture/http/routes/violationRouter";
import { violationRecordRouter } from "../../../../../modules/violationRecord/src/infrastructure/http/routes/violationRecordRouter";
import { paymentRouter } from "../../../../../modules/violationRecordPayment/src/infrastracture/http/routes/paymentRouter";
import { violationRecordAuditLogRouter } from "../../../../../modules/violationRecordAuditLog/src/infrastructure/http/routes/violationRecordAuditLogRouter";

const v1Router = Router();

v1Router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Uni-traffic Backend API v1" });
});
v1Router.use("/auth", authRouter);
v1Router.use("/vehicle", vehicleRouter);
v1Router.use("/violation", violationRouter);
v1Router.use("/violation-record", violationRecordRouter);
v1Router.use("/user", userRouter);
v1Router.use("/payment", paymentRouter);
v1Router.use("/audit-log/violation-record", violationRecordAuditLogRouter);

export { v1Router };
