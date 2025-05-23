import { type Request, type Response, Router } from "express";
import { auditLogRouter } from "../../../../../modules/auditLog/src/infrastructure/http/routes/auditLogRouter";
import { fileRouter } from "../../../../../modules/file/src/infrastructure/http/routes/fileRouter";
import { authRouter } from "../../../../../modules/user/src/infrastructure/http/routes/authRouter";
import { userRouter } from "../../../../../modules/user/src/infrastructure/http/routes/userRouter";
import { userSignInActivityRouter } from "../../../../../modules/userSignInActivity/src/infrastructure/routes/userSignInActivityRouter";
import { vehicleRouter } from "../../../../../modules/vehicle/src/infrastracture/http/routes/vehicleRouter";
import { vehicleApplicationRouter } from "../../../../../modules/vehicleApplication/src/infrastructure/http/routes/vehicleApplicationRouter";
import { vehicleApplicationPaymentRouter } from "../../../../../modules/vehicleApplicationPayment/src/infrastructure/http/routes/paymentRouter";
import { violationRouter } from "../../../../../modules/violation/src/infrastracture/http/routes/violationRouter";
import { violationRecordRouter } from "../../../../../modules/violationRecord/src/infrastructure/http/routes/violationRecordRouter";
import { paymentRouter } from "../../../../../modules/violationRecordPayment/src/infrastracture/http/routes/paymentRouter";
import { EnvValidator } from "../../../../lib/envValidator";

const v1Router = Router();

v1Router.get("/", (req: Request, res: Response) => {
  const keyValidator = new EnvValidator();
  const missingKeys = keyValidator.validate();
  if (missingKeys.length > 0) {
    res.status(500).json({
      message: "System configuration is incomplete. Required setup values are missing.",
      code: missingKeys
    });
    return;
  }

  res.status(200).json({ message: "Uni-traffic API v1" });
});
v1Router.use("/auth", authRouter);
v1Router.use("/vehicle", vehicleRouter);
v1Router.use("/violation", violationRouter);
v1Router.use("/violation-record", violationRecordRouter);
v1Router.use("/user", userRouter);
v1Router.use("/payment", paymentRouter);
v1Router.use("/files", fileRouter);
v1Router.use("/vehicle-application", vehicleApplicationRouter);
v1Router.use("/payment", vehicleApplicationPaymentRouter);
v1Router.use("/audit-log", auditLogRouter);
v1Router.use("/sign-in-activity", userSignInActivityRouter);

export { v1Router };
