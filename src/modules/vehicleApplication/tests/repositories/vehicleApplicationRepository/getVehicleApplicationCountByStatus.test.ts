import { faker } from "@faker-js/faker";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import {
  type IVehicleApplicationRepository,
  VehicleApplicationRepository
} from "../../../src/repositories/vehicleApplicationRepository";
import { seedVehicleApplication } from "../../utils/seedVehicleApplication";

describe("VehicleApplicationRepository.getVehicleApplicationCountByStatus", () => {
  let vehicleApplicationRepository: IVehicleApplicationRepository;

  beforeAll(async () => {
    vehicleApplicationRepository = new VehicleApplicationRepository();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return the correct count for each vehicle application status", async () => {
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

    const result = await vehicleApplicationRepository.getVehicleApplicationCountByStatus();

    expect(result).toContainEqual({ status: "APPROVED", count: 2 });
    expect(result).toContainEqual({ status: "PENDING_FOR_STICKER", count: 3 });
    expect(result).toContainEqual({ status: "PENDING_FOR_PAYMENT", count: 2 });
    expect(result).toContainEqual({ status: "PENDING_FOR_SECURITY_APPROVAL", count: 1 });
    expect(result).toContainEqual({ status: "REJECTED", count: 5 });
  });

  it("should return the correct count for the given status", async () => {
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

    const result = await vehicleApplicationRepository.getVehicleApplicationCountByStatus(status);

    expect(result).toContainEqual({ status: status, count: 6 });
  });
});
