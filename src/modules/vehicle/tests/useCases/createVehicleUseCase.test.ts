import { faker } from "@faker-js/faker";
import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IVehicleFactoryProps } from "../../src/domain/models/vehicle/factory";
import { CreateVehicleUseCase } from "../../src/useCases/createVehicleUseCase";
import { seedVehicle } from "../utils/vehicle/seedVehicle";

describe("CreateVehicleUseCase", () => {
  let createVehicleUseCase: CreateVehicleUseCase;
  let newVehicleData: IVehicleFactoryProps;

  beforeAll(() => {
    createVehicleUseCase = new CreateVehicleUseCase();
  });

  beforeEach(async () => {
    await db.vehicle.deleteMany();

    newVehicleData = {
      ownerId: faker.string.uuid(),
      licensePlate: faker.vehicle.vrm(),
      make: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      series: faker.string.alphanumeric(4),
      color: faker.vehicle.color(),
      type: faker.helpers.arrayElement(["Sedan", "SUV", "Truck", "Motorcycle"]),
      images: [faker.image.url(), faker.image.url()],
      stickerNumber: faker.string.alphanumeric(10),
      status: "REGISTERED"
    };
  });

  it("should create the vehicle successfully", async () => {
    const createdVehicle = await createVehicleUseCase.execute(newVehicleData);

    expect(createdVehicle).toBeTruthy();
    expect(createdVehicle.id).toBeDefined();
    expect(createdVehicle.licensePlate).toBe(newVehicleData.licensePlate);
    expect(createdVehicle.make).toBe(newVehicleData.make);
    expect(createdVehicle.model).toBe(newVehicleData.model);
    expect(createdVehicle.series).toBe(newVehicleData.series);
    expect(createdVehicle.color).toBe(newVehicleData.color);
    expect(createdVehicle.type).toBe(newVehicleData.type);
    expect(createdVehicle.images).toStrictEqual(newVehicleData.images);
    expect(createdVehicle.stickerNumber).toBe(newVehicleData.stickerNumber);
  });

  it("should throw ConflictError when license plate is already in use", async () => {
    await seedVehicle({ licensePlate: newVehicleData.licensePlate });

    let message = "";
    try {
      await createVehicleUseCase.execute(newVehicleData);
    } catch (error) {
      message = (error as Error).message;
    }

    expect(message).toBeTruthy();
    expect(message).toEqual("A vehicle with this license plate already exists.");
  });

  it("should throw BadRequest when vehicle data is invalid", async () => {
    const invalidData = { ...newVehicleData, licensePlate: "" };

    let message = "";
    try {
      await createVehicleUseCase.execute(invalidData);
    } catch (error) {
      message = (error as Error).message;
    }

    expect(message).toBeTruthy();
    expect(message).toEqual("Vehicle creation failed due to invalid data.");
  });

  it("should throw UnexpectedError when vehicle cannot be saved to database", async () => {
    const mockCreateVehicle = jest.fn().mockRejectedValue(new Error("Database error"));
    createVehicleUseCase['_vehicleRepository'].createVehicle = mockCreateVehicle;

    let message = "";
    try {
      await createVehicleUseCase.execute(newVehicleData);
    } catch (error) {
      message = (error as Error).message;
    }

    expect(message).toBeTruthy();
    expect(message).toEqual("Failed to save vehicle to database.");
  });
});
