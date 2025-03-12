import { faker } from "@faker-js/faker";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import { seedViolationRecord } from "../../../violationRecord/tests/utils/violationRecord/seedViolationRecord";
import type { ICreateViolationRecordAuditLogProps } from "../../src/dtos/violationRecordAuditLogDTO";
import {
  type IViolationRecordAuditLogService,
  ViolationRecordAuditLogService
} from "../../src/service/violationRecordAuditLogService";

describe("ViolationRecordAuditLogService", () => {
  let service: IViolationRecordAuditLogService;

  beforeAll(() => {
    service = new ViolationRecordAuditLogService();
  });

  it("should successfully create a violation record audit log", async () => {
    const seededActor = await seedUser({ role: "CASHIER" });
    const seededViolationRecord = await seedViolationRecord({ status: "PAID" });
    const requestParams: ICreateViolationRecordAuditLogProps = {
      actorId: seededActor.id,
      violationRecordId: seededViolationRecord.id,
      auditLogType: "UPDATE",
      details:
        "Violation record payment status updated. Payment ID: [ViolationRecordPaymentId], Status changed from [OldStatus] to [NewStatus]."
    };

    const result = await service.createAndSaveViolationRecordAuditLog(requestParams);

    expect(result).not.toBeNull();
  });

  it("should fail to create a violation record audit log when given references dont exist", async () => {
    const requestParams: ICreateViolationRecordAuditLogProps = {
      actorId: faker.string.uuid(),
      violationRecordId: faker.string.uuid(),
      auditLogType: "UPDATE",
      details:
        "Violation record payment status updated. Payment ID: [ViolationRecordPaymentId], Status changed from [OldStatus] to [NewStatus]."
    };

    const result = await service.createAndSaveViolationRecordAuditLog(requestParams);

    expect(result).toBeNull();
  });
});
