import { faker } from "@faker-js/faker";
import { ForbiddenError } from "../../../../shared/core/errors";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import { GetTotalUniqueSignInByGivenRangeUseCase } from "../../src/useCases/getTotalUniqueSignInByGivenRangeUseCase";
import { seedUserSignInActivity } from "../utils/seedUserSignInActivity";

describe("GetTotalViolationGivenByRangeUseCase", () => {
  let useCase: GetTotalUniqueSignInByGivenRangeUseCase;

  beforeAll(() => {
    useCase = new GetTotalUniqueSignInByGivenRangeUseCase();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return the correct count of user sign in activity by DAY on given range", async () => {
    const seededActor = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"])
    });
    const seededUser = await seedUser({});
    await Promise.all([
      seedUserSignInActivity({ time: new Date("2024-05-01"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2024-05-01"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2024-05-01") }),
      seedUserSignInActivity({ time: new Date("2024-05-02") }),
      seedUserSignInActivity({ time: new Date("2024-05-02") }),
      seedUserSignInActivity({ time: new Date("2024-05-03") }),
      seedUserSignInActivity({ time: new Date("2024-05-03") })
    ]);

    const result = await useCase.execute({
      startDate: "2024-05-01T00:00:00.000Z",
      endDate: "2024-05-05T23:59:59.999Z",
      type: "DAY",
      actorId: seededActor.id
    });

    expect(result).toContainEqual({ date: "2024-05-01", count: 2 });
    expect(result).toContainEqual({ date: "2024-05-02", count: 2 });
    expect(result).toContainEqual({ date: "2024-05-03", count: 2 });
  });

  it("should return the correct count of user sign in activity by MONTH on given range", async () => {
    const seededActor = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"])
    });
    const seededUser = await seedUser({});
    await Promise.all([
      seedUserSignInActivity({ time: new Date("2024-05"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2024-05"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2024-05") }),
      seedUserSignInActivity({ time: new Date("2024-06") }),
      seedUserSignInActivity({ time: new Date("2024-06-01"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2024-06-01"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2024-06-02"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2024-06-02"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2024-06") }),
      seedUserSignInActivity({ time: new Date("2024-08") }),
      seedUserSignInActivity({ time: new Date("2024-08") })
    ]);

    const result = await useCase.execute({
      startDate: "2024-01-01T00:00:00.000Z",
      endDate: "2024-12-31T23:59:59.999Z",
      type: "MONTH",
      actorId: seededActor.id
    });

    expect(result).toContainEqual({ date: "2024-05", count: 2 });
    expect(result).toContainEqual({ date: "2024-06", count: 4 });
    expect(result).toContainEqual({ date: "2024-08", count: 2 });
  });

  it("should return the correct count of user sign in activity by YEAR on given range", async () => {
    const seededActor = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"])
    });
    const seededUser = await seedUser({});
    await Promise.all([
      seedUserSignInActivity({ time: new Date("2024"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2024"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2024") }),
      seedUserSignInActivity({ time: new Date("2025-06") }),
      seedUserSignInActivity({ time: new Date("2025-06-01"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2025-06-01"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2025-06-02"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2025-06-02"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2021-06") }),
      seedUserSignInActivity({ time: new Date("2021-08") }),
      seedUserSignInActivity({ time: new Date("2021-08") })
    ]);

    const result = await useCase.execute({
      startDate: "2020-01-01T00:00:00.000Z",
      endDate: "2025-12-31T23:59:59.999Z",
      type: "YEAR",
      actorId: seededActor.id
    });

    expect(result).toContainEqual({ date: "2024", count: 2 });
    expect(result).toContainEqual({ date: "2025", count: 3 });
    expect(result).toContainEqual({ date: "2021", count: 3 });
  });

  it("should throw ForbiddenError when user doesn't have permission", async () => {
    const seededActor = await seedUser({
      role: faker.helpers.arrayElement(["GUEST", "STUDENT", "STAFF"])
    });

    await expect(
      useCase.execute({
        startDate: "2020-01-01T00:00:00.000Z",
        endDate: "2025-12-31T23:59:59.999Z",
        type: "YEAR",
        actorId: seededActor.id
      })
    ).rejects.toThrow(new ForbiddenError("You do not have permission to perform this action."));
  });
});
