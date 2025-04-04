import { faker } from "@faker-js/faker";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import type { IVehicleFactoryProps } from "../../src/domain/models/vehicle/factory";
import { CreateVehicleUseCase } from "../../src/useCases/createVehicleUseCase";
import { seedVehicle } from "../utils/vehicle/seedVehicle";

describe("CreateVehicleUseCase", () => {
  let createVehicleUseCase: CreateVehicleUseCase;
  let mockVehicleData: IVehicleFactoryProps;

  beforeAll(() => {
    createVehicleUseCase = new CreateVehicleUseCase();
  });

  beforeEach(async () => {
    await db.vehicle.deleteMany();

    const seededOwner = await seedUser({ role: "GUEST" });
    mockVehicleData = {
      ownerId: seededOwner.id,
      licensePlate: faker.vehicle.vrm(),
      make: faker.vehicle.manufacturer(),
      model: faker.date.past().getFullYear().toString(),
      series: faker.vehicle.model(),
      color: faker.vehicle.color(),
      type: faker.helpers.arrayElement(["CAR", "MOTORCYCLE"]),
      images: Array.from({ length: 3 }).map(() => faker.image.url()),
      stickerNumber: faker.number.bigInt({ min: 10_000_000, max: 99_999_999 }).toString(),
      status: "REGISTERED"
    };
  });

  it("should create the vehicle successfully", async () => {
    const createdVehicle = await createVehicleUseCase.execute(mockVehicleData);

    expect(createdVehicle).toBeTruthy();
    expect(createdVehicle.id).toBeDefined();
    expect(createdVehicle.licensePlate).toBe(mockVehicleData.licensePlate);
    expect(createdVehicle.make).toBe(mockVehicleData.make);
    expect(createdVehicle.model).toBe(mockVehicleData.model);
    expect(createdVehicle.series).toBe(mockVehicleData.series);
    expect(createdVehicle.color).toBe(mockVehicleData.color);
    expect(createdVehicle.type).toBe(mockVehicleData.type);
    expect(createdVehicle.images).toStrictEqual(mockVehicleData.images);
    expect(createdVehicle.stickerNumber).toBe(mockVehicleData.stickerNumber);
  });

  it("should throw ConflictError when license plate is already in use", async () => {
    await seedVehicle({ licensePlate: mockVehicleData.licensePlate });

    let message = "";
    try {
      await createVehicleUseCase.execute(mockVehicleData);
    } catch (error) {
      message = (error as Error).message;
    }

    expect(message).toBeTruthy();
    expect(message).toEqual("A vehicle with this license plate already exists.");
  });

  it("should throw BadRequest when vehicle data is invalid", async () => {
    const invalidData = { ...mockVehicleData, licensePlate: "" };

    let message = "";
    try {
      await createVehicleUseCase.execute(invalidData);
    } catch (error) {
      message = (error as Error).message;
    }

    expect(message).toBeTruthy();
    expect(message).toContain("is not a valid license plate number");
  });
});
