import { faker } from "@faker-js/faker";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import { CountUserSignInActivityByRangeUseCase } from "../../src/useCases/countUserSignInActivityByRangeUseCase";
import { seedUserSignInActivity } from "../utils/seedUserSignInActivity";

describe("CountUserSignInActivityByRangeUseCase", () => {
  let useCase: CountUserSignInActivityByRangeUseCase;

  beforeAll(() => {
    useCase = new CountUserSignInActivityByRangeUseCase();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should successfully return the correct count", async () => {
    await Promise.all([
      seedUserSignInActivity({
        time: faker.date.between({
          from: "2025-04-01T00:00:00.000Z",
          to: "2025-04-30T23:59:59.999Z"
        })
      }),
      seedUserSignInActivity({
        time: faker.date.between({
          from: "2025-04-01T00:00:00.000Z",
          to: "2025-04-30T23:59:59.999Z"
        })
      }),
      seedUserSignInActivity({
        time: faker.date.between({
          from: "2025-04-01T00:00:00.000Z",
          to: "2025-04-30T23:59:59.999Z"
        })
      }),
      seedUserSignInActivity({
        time: faker.date.between({
          from: "2025-04-01T00:00:00.000Z",
          to: "2025-04-30T23:59:59.999Z"
        })
      }),
      seedUserSignInActivity({
        time: faker.date.between({
          from: "2025-04-01T00:00:00.000Z",
          to: "2025-04-30T23:59:59.999Z"
        })
      })
    ]);

    const result = await useCase.execute({
      startDate: "2025-04-01",
      endDate: "2025-04-30"
    });

    expect(result.count).toBe(5);
  });

  it("should successfully return the correct count when user has multiple different sign ins", async () => {
    const seededUser = await seedUser({ role: "STUDENT" });
    await Promise.all([
      seedUserSignInActivity({
        time: faker.date.between({
          from: "2025-03-01T00:00:00.000Z",
          to: "2025-03-30T23:59:59.999Z"
        })
      }),
      seedUserSignInActivity({
        time: faker.date.between({
          from: "2025-04-01T00:00:00.000Z",
          to: "2025-04-30T23:59:59.999Z"
        })
      }),
      seedUserSignInActivity({
        userId: seededUser.id,
        time: faker.date.between({
          from: "2025-04-01T00:00:00.000Z",
          to: "2025-04-30T23:59:59.999Z"
        })
      }),
      seedUserSignInActivity({
        userId: seededUser.id,
        time: faker.date.between({
          from: "2025-04-01T00:00:00.000Z",
          to: "2025-04-30T23:59:59.999Z"
        })
      }),
      seedUserSignInActivity({
        userId: seededUser.id,
        time: faker.date.between({
          from: "2025-04-01T00:00:00.000Z",
          to: "2025-04-30T23:59:59.999Z"
        })
      }),
      seedUserSignInActivity({
        time: faker.date.between({
          from: "2025-04-01T00:00:00.000Z",
          to: "2025-04-30T23:59:59.999Z"
        })
      })
    ]);

    const result = await useCase.execute({
      startDate: "2025-04-01",
      endDate: "2025-04-30"
    });

    expect(result.count).toBe(3);
  });
});
