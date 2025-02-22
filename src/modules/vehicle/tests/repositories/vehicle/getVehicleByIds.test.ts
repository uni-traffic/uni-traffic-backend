import { db } from "../../../../../shared/infrastructure/database/prisma";
import type { IVehicleRepository } from "../../../src/repositories/vehicleRepository";
import { VehicleRepository } from "../../../src/repositories/vehicleRepository";
import { seedVehicle } from "../../utils/vehicle/seedVehicle";

describe("VehicleRepository.getVehiclesByIds", () => {
  let vehicleRepository: IVehicleRepository;

  beforeAll(async () => {
    vehicleRepository = new VehicleRepository();
  });

  beforeEach(async () => {
    await db.vehicle.deleteMany();
  });

  it("should retrieve multiple vehicles by IDs", async () => {
    const vehicleOne = await seedVehicle({});
    const vehicleTwo = await seedVehicle({});

    const vehicles = await vehicleRepository.getVehiclesByIds([vehicleOne.id, vehicleTwo.id]);
    expect(vehicles.length).toBe(2);
    expect(vehicles[0].id).toBe(vehicleOne.id);
    expect(vehicles[1].id).toBe(vehicleTwo.id);
  });

  it("should return an empty array when given non-existing vehicle IDs", async () => {
    const vehicles = await vehicleRepository.getVehiclesByIds(["non-existing-id"]);
    expect(vehicles).toEqual([]);
  });
});
