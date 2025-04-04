import { faker } from "@faker-js/faker";
import { ConflictError } from "../../../../shared/core/errors";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import type { IVehicleFactoryProps } from "../../src/domain/models/vehicle/factory";
import { type IVehicleService, VehicleService } from "../../src/service/vehicleService";
import { CreateVehicleUseCase } from "../../src/useCases/createVehicleUseCase";

describe("VehicleService", () => {
  let service: IVehicleService;
  let createVehicleUseCase: CreateVehicleUseCase;
  let mockVehicleData: IVehicleFactoryProps;

  beforeAll(() => {
    createVehicleUseCase = new CreateVehicleUseCase();
    service = new VehicleService(createVehicleUseCase);
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

  it("should successfully create a vehicle", async () => {
    const mockCreateVehicle = jest.fn().mockResolvedValue(mockVehicleData);
    createVehicleUseCase.execute = mockCreateVehicle;

    const result = await service.createVehicle({
      ownerId: mockVehicleData.ownerId,
      licensePlate: mockVehicleData.licensePlate,
      make: mockVehicleData.make,
      model: mockVehicleData.model,
      series: mockVehicleData.series,
      color: mockVehicleData.color,
      type: mockVehicleData.type,
      images: mockVehicleData.images,
      stickerNumber: mockVehicleData.stickerNumber,
      status: mockVehicleData.status
    });

    expect(mockCreateVehicle).toHaveBeenCalledWith({
      ownerId: mockVehicleData.ownerId,
      licensePlate: mockVehicleData.licensePlate,
      make: mockVehicleData.make,
      model: mockVehicleData.model,
      series: mockVehicleData.series,
      color: mockVehicleData.color,
      type: mockVehicleData.type,
      images: mockVehicleData.images,
      stickerNumber: mockVehicleData.stickerNumber,
      status: mockVehicleData.status
    });

    expect(result).toEqual(mockVehicleData);
  });

  it("should throw ConflictError when vehicle with the same license plate already exists", async () => {
    createVehicleUseCase.execute = jest
      .fn()
      .mockRejectedValue(new ConflictError("A vehicle with this license plate already exists."));

    await expect(
      service.createVehicle({
        ownerId: mockVehicleData.ownerId,
        licensePlate: mockVehicleData.licensePlate,
        make: mockVehicleData.make,
        model: mockVehicleData.model,
        series: mockVehicleData.series,
        color: mockVehicleData.color,
        type: mockVehicleData.type,
        images: mockVehicleData.images,
        stickerNumber: mockVehicleData.stickerNumber,
        status: mockVehicleData.status
      })
    ).rejects.toThrow(ConflictError);
  });

  it("should throw an error when vehicle creation fails", async () => {
    createVehicleUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error("Vehicle creation failed."));

    await expect(
      service.createVehicle({
        ownerId: mockVehicleData.ownerId,
        licensePlate: mockVehicleData.licensePlate,
        make: mockVehicleData.make,
        model: mockVehicleData.model,
        series: mockVehicleData.series,
        color: mockVehicleData.color,
        type: mockVehicleData.type,
        images: mockVehicleData.images,
        stickerNumber: mockVehicleData.stickerNumber,
        status: mockVehicleData.status
      })
    ).rejects.toThrow("Vehicle creation failed.");
  });
});
