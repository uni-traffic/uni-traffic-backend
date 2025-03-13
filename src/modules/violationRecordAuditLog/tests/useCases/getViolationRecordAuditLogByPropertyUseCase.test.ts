import { faker } from "@faker-js/faker";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import { seedViolationRecord } from "../../../violationRecord/tests/utils/violationRecord/seedViolationRecord";
import { GetViolationRecordAuditLogByPropertyUseCase } from "../../src/useCases/getViolationRecordAuditLogByPropertyUseCase";
import { seedViolationRecordAuditLog } from "../utils/seedViolationRecordAuditLog";
import { NotFoundError } from "../../../../shared/core/errors";

describe("GetViolationRecordAuditLogByPropertyUseCase", () => {
  let getViolationRecordAuditLogByPropertyUseCase: GetViolationRecordAuditLogByPropertyUseCase;

  beforeAll(async () => {
    getViolationRecordAuditLogByPropertyUseCase = new GetViolationRecordAuditLogByPropertyUseCase();
  });

  beforeEach(async () => {
    await db.violationRecordAuditLog.deleteMany();
  });

  it("should return number of violation record audit log with count given", async () => {
    await seedViolationRecordAuditLog({});
    await seedViolationRecordAuditLog({});
    await seedViolationRecordAuditLog({});
    await seedViolationRecordAuditLog({});

    const result = await getViolationRecordAuditLogByPropertyUseCase.execute({
      count: "3",
      page: "1"
    });

    expect(result.length).toBe(3);
    expect(result).not.toBe([]);
  });

  it("should return record that match the given id", async () => {
    const seededViolationRecordAuditLog = await seedViolationRecordAuditLog({});

    const result = await getViolationRecordAuditLogByPropertyUseCase.execute({
      id: seededViolationRecordAuditLog.id,
      count: "1",
      page: "1"
    });

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(seededViolationRecordAuditLog.id);
  });

  it("should return record that match the given actor id", async () => {
    const seededUser = await seedUser({});
    const seededViolationRecordAuditLog1 = await seedViolationRecordAuditLog({
      actorId: seededUser.id
    });
    const seededViolationRecordAuditLog2 = await seedViolationRecordAuditLog({
      actorId: seededUser.id
    });
    const seededViolationRecordAuditLog3 = await seedViolationRecordAuditLog({
      actorId: seededUser.id
    });
    const seededViolationRecordAuditLog4 = await seedViolationRecordAuditLog({});

    const result = await getViolationRecordAuditLogByPropertyUseCase.execute({
      actorId: seededUser.id,
      count: "5",
      page: "1"
    });

    const mappedViolationRecordAuditLog = result.map(
      (violationRecordAuditLog) => violationRecordAuditLog.id
    );

    expect(result.length).toBe(3);
    expect(mappedViolationRecordAuditLog).toContain(seededViolationRecordAuditLog1.id);
    expect(mappedViolationRecordAuditLog).toContain(seededViolationRecordAuditLog2.id);
    expect(mappedViolationRecordAuditLog).toContain(seededViolationRecordAuditLog3.id);
    expect(mappedViolationRecordAuditLog).not.toContain(seededViolationRecordAuditLog4.id);
  });

  it("should return record that match the given audit log type", async () => {
    const seededViolationRecordAuditLog = await seedViolationRecordAuditLog({
      auditLogType: "CREATE"
    });
    const seededViolationRecordAuditLog1 = await seedViolationRecordAuditLog({
      auditLogType: "CREATE"
    });
    const seededViolationRecordAuditLog2 = await seedViolationRecordAuditLog({
      auditLogType: "CREATE"
    });
    const seededViolationRecordAuditLog3 = await seedViolationRecordAuditLog({
      auditLogType: "UPDATE"
    });
    const seededViolationRecordAuditLog4 = await seedViolationRecordAuditLog({
      auditLogType: "DELETE"
    });

    const result = await getViolationRecordAuditLogByPropertyUseCase.execute({
      auditLogType: seededViolationRecordAuditLog.auditLogType,
      count: "5",
      page: "1"
    });

    const mappedAuditLog = result.map((violationRecordAuditLog) => violationRecordAuditLog.id);

    expect(result.length).not.toBe([]);
    expect(result.length).toBe(3);
    expect(mappedAuditLog).toContain(seededViolationRecordAuditLog.id);
    expect(mappedAuditLog).toContain(seededViolationRecordAuditLog1.id);
    expect(mappedAuditLog).toContain(seededViolationRecordAuditLog2.id);
    expect(mappedAuditLog).not.toContain(seededViolationRecordAuditLog3.id);
    expect(mappedAuditLog).not.toContain(seededViolationRecordAuditLog4.id);
  });

  it("should return record that match the given violation record id", async () => {
    const seededViolationRecord = await seedViolationRecord({});
    const seededViolationRecordAuditLog1 = await seedViolationRecordAuditLog({
      violationRecordId: seededViolationRecord.id
    });
    const seededViolationRecordAuditLog2 = await seedViolationRecordAuditLog({
      violationRecordId: seededViolationRecord.id
    });
    const seededViolationRecordAuditLog3 = await seedViolationRecordAuditLog({
      violationRecordId: seededViolationRecord.id
    });
    const seededViolationRecordAuditLog4 = await seedViolationRecordAuditLog({});

    const result = await getViolationRecordAuditLogByPropertyUseCase.execute({
      violationRecordId: seededViolationRecord.id,
      count: "5",
      page: "1"
    });

    const mappedAuditLog = result.map((violationRecordAuditLog) => violationRecordAuditLog.id);

    expect(result.length).toBe(3);
    expect(mappedAuditLog).toContain(seededViolationRecordAuditLog1.id);
    expect(mappedAuditLog).toContain(seededViolationRecordAuditLog2.id);
    expect(mappedAuditLog).toContain(seededViolationRecordAuditLog3.id);
    expect(mappedAuditLog).not.toContain(seededViolationRecordAuditLog4.id);
  });

  it("should return record that match the given parameters", async () => {
    const seededUser = await seedUser({});
    const seededViolationRecord = await seedViolationRecord({});
    const seededViolationRecordAuditLog1 = await seedViolationRecordAuditLog({
      auditLogType: "CREATE",
      actorId: seededUser.id,
      violationRecordId: seededViolationRecord.id
    });
    const seededViolationRecordAuditLog2 = await seedViolationRecordAuditLog({
      auditLogType: "CREATE",
      actorId: seededUser.id,
      violationRecordId: seededViolationRecord.id
    });
    const seededViolationRecordAuditLog3 = await seedViolationRecordAuditLog({
      auditLogType: "CREATE",
      actorId: seededUser.id,
      violationRecordId: seededViolationRecord.id
    });
    const seededViolationRecordAuditLog4 = await seedViolationRecordAuditLog({
      auditLogType: "UPDATE",
      actorId: seededUser.id,
      violationRecordId: seededViolationRecord.id
    });

    const result = await getViolationRecordAuditLogByPropertyUseCase.execute({
      auditLogType: "CREATE",
      actorId: seededUser.id,
      violationRecordId: seededViolationRecord.id,
      count: "5",
      page: "1"
    });

    const mappedAuditLog = result.map((violationRecordAuditLog) => violationRecordAuditLog.id);

    expect(result.length).toBe(3);
    expect(mappedAuditLog).toContain(seededViolationRecordAuditLog1.id);
    expect(mappedAuditLog).toContain(seededViolationRecordAuditLog2.id);
    expect(mappedAuditLog).toContain(seededViolationRecordAuditLog3.id);
    expect(mappedAuditLog).not.toContain(seededViolationRecordAuditLog4.id);
  });

  it("should throw an error if the id given does not exist in the database", async () => {
    await seedViolationRecordAuditLog({});

    await expect(
      getViolationRecordAuditLogByPropertyUseCase.execute({
        id: faker.string.uuid(),
        count: "1",
        page: "1"
      })
    ).rejects.toThrow(new NotFoundError("Violation Record Audit Log not found"));
  });
});
