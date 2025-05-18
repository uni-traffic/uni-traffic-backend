import { faker } from "@faker-js/faker";
import { ForbiddenError } from "../../../../shared/core/errors";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import { GetUnpaidAndPaidViolationTotalUseCase } from "../../src/useCases/getUnpaidAndPaidViolationTotalUseCase";
import { seedViolationRecord } from "../utils/violationRecord/seedViolationRecord";

describe("GetUnpaidAndPaidViolationTotalUseCase", () => {
  let useCase: GetUnpaidAndPaidViolationTotalUseCase;

  beforeAll(() => {
    useCase = new GetUnpaidAndPaidViolationTotalUseCase();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
    await db.violation.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should successfully return the correct total for unpaid and paid violation record", async () => {
    const seededUser = await seedUser({ role: "SUPERADMIN" });

    const unpaidPenalty = faker.helpers.arrayElement<number>([250, 500, 1000]);
    const paidPenalty = faker.helpers.arrayElement<number>([250, 500, 1000]);

    await Promise.all([
      seedViolationRecord({ status: "PAID", penalty: paidPenalty }),
      seedViolationRecord({ status: "UNPAID", penalty: unpaidPenalty }),
      seedViolationRecord({ status: "PAID", penalty: paidPenalty }),
      seedViolationRecord({ status: "UNPAID", penalty: unpaidPenalty }),
      seedViolationRecord({ status: "PAID", penalty: paidPenalty }),
      seedViolationRecord({ status: "UNPAID", penalty: unpaidPenalty })
    ]);

    const result = await useCase.execute({ actorId: seededUser.id });

    expect(result.paidTotal).toBe(paidPenalty * 3);
    expect(result.unpaidTotal).toBe(unpaidPenalty * 3);
  });

  it("should throw ForbiddenError when trying to execute the use case with invalid role", async () => {
    const seededUser = await seedUser({
      role: faker.helpers.arrayElement(["STUDENT", "STAFF", "GUEST"])
    });

    await expect(useCase.execute({ actorId: seededUser.id })).rejects.toThrow(
      new ForbiddenError("You do not have permission to perform this action.")
    );
  });
});
