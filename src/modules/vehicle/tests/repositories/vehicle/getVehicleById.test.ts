import { db } from "../../../../../shared/infrastructure/database/prisma";
import type { IVehicleRepository } from "../../../src/repositories/vehicleRepository";
import { VehicleRepository } from "../../../src/repositories/vehicleRepository";
import { seedVehicle } from "../../utils/vehicle/seedVehicle";

describe("VehicleRepository.getVehicleById", () => {
  let vehicleRepository: IVehicleRepository;

  beforeAll(async () => {
    vehicleRepository = new VehicleRepository();
  });

  beforeEach(async () => {
    await db.vehicle.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should retrieve an existing vehicle by ID", async () => {
    const seededVehicle = await seedVehicle({});
    const vehicle = await vehicleRepository.getVehicleById(seededVehicle.id);
    expect(vehicle).toBeTruthy();
    expect(vehicle?.id).toBe(seededVehicle.id);
  });

  it("should return null for a non-existing vehicle ID", async () => {
    const vehicle = await vehicleRepository.getVehicleById("non-existing-id");
    expect(vehicle).toBeNull();
  });
});
