import { db } from "../../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import {
  AuditLogRepository,
  type IAuditLogRepository
} from "../../../src/repositories/auditLogRepository";
import { seedAuditLog } from "../../utils/auditLog/seedAuditLog";

describe("AuditLogRepository.countTotalAuditLogs", () => {
  let auditLogRepository: IAuditLogRepository;

  beforeAll(() => {
    auditLogRepository = new AuditLogRepository();
  });

  beforeEach(async () => {
    await db.user.deleteMany({});
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should successfully return the correct total of audit log", async () => {
    const seededAuditLogs = await Promise.all([
      seedAuditLog({}),
      seedAuditLog({}),
      seedAuditLog({}),
      seedAuditLog({})
    ]);

    const totalCount = await auditLogRepository.countTotalAuditLogs({});

    expect(totalCount).toBe(seededAuditLogs.length);
  });

  it("should successfully count audit logs that match the searchKey", async () => {
    const seedActor = await seedUser({ role: "ADMIN" });
    await Promise.all([
      seedAuditLog({ actorId: seedActor.id }),
      seedAuditLog({ actorId: seedActor.id }),
      seedAuditLog({ actorId: seedActor.id }),
      seedAuditLog({ actorId: seedActor.id }),
      seedAuditLog({})
    ]);

    const totalCount = await auditLogRepository.countTotalAuditLogs({
      searchKey: seedActor.id.substring(0, 8)
    });

    expect(totalCount).toBe(4);
  });
});
