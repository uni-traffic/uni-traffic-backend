import { faker } from "@faker-js/faker";
import { ForbiddenError } from "../../../../shared/core/errors";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import { GetVehicleApplicationCountByStatusUseCase } from "../../src/useCases/getVehicleApplicationCountByStatusUseCase";
import { seedVehicleApplication } from "../utils/seedVehicleApplication";

describe("GetVehicleApplicationCountByStatusUseCase", () => {
  let useCase: GetVehicleApplicationCountByStatusUseCase;

  beforeAll(() => {
    useCase = new GetVehicleApplicationCountByStatusUseCase();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should successfully return the correct count when no status is provided", async () => {
    const seededActor = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"])
    });
    await Promise.all([
      seedVehicleApplication({ status: "APPROVED" }),
      seedVehicleApplication({ status: "APPROVED" }),
      seedVehicleApplication({ status: "PENDING_FOR_STICKER" }),
      seedVehicleApplication({ status: "PENDING_FOR_STICKER" }),
      seedVehicleApplication({ status: "PENDING_FOR_STICKER" }),
      seedVehicleApplication({ status: "PENDING_FOR_PAYMENT" }),
      seedVehicleApplication({ status: "PENDING_FOR_PAYMENT" }),
      seedVehicleApplication({ status: "PENDING_FOR_SECURITY_APPROVAL" }),
      seedVehicleApplication({ status: "REJECTED" }),
      seedVehicleApplication({ status: "REJECTED" }),
      seedVehicleApplication({ status: "REJECTED" }),
      seedVehicleApplication({ status: "REJECTED" }),
      seedVehicleApplication({ status: "REJECTED" })
    ]);

    const result = await useCase.execute({ actorId: seededActor.id });

    expect(result).toContainEqual({ status: "APPROVED", count: 2 });
    expect(result).toContainEqual({ status: "PENDING_FOR_STICKER", count: 3 });
    expect(result).toContainEqual({ status: "PENDING_FOR_PAYMENT", count: 2 });
    expect(result).toContainEqual({ status: "PENDING_FOR_SECURITY_APPROVAL", count: 1 });
    expect(result).toContainEqual({ status: "REJECTED", count: 5 });
  });

  it("should return the correct count for the given status", async () => {
    const seededActor = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"])
    });
    const status = faker.helpers.arrayElement([
      "APPROVED",
      "PENDING_FOR_STICKER",
      "PENDING_FOR_PAYMENT",
      "PENDING_FOR_SECURITY_APPROVAL",
      "REJECTED"
    ]);
    await Promise.all([
      seedVehicleApplication({ status: status }),
      seedVehicleApplication({ status: status }),
      seedVehicleApplication({ status: status }),
      seedVehicleApplication({ status: status }),
      seedVehicleApplication({ status: status }),
      seedVehicleApplication({ status: status })
    ]);

    const result = await useCase.execute({ actorId: seededActor.id, status });

    expect(result).toContainEqual({ status: status, count: 6 });
  });

  it("should throw ForbiddenError when actor lacks permission", async () => {
    const seededActor = await seedUser({
      role: faker.helpers.arrayElement(["GUEST", "STUDENT", "STAFF"])
    });

    await expect(useCase.execute({ actorId: seededActor.id })).rejects.toThrow(
      new ForbiddenError("You do not have permission to perform this action.")
    );
  });
});
