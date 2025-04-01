import { VehicleService, type IVehicleService } from "../../src/service/createVehicleService";
import { CreateVehicleUseCase } from "../../src/useCases/createVehicleUseCase";
import { IVehicleDTO } from "../../src/dtos/vehicleDTO";
import { faker } from "@faker-js/faker";
import { ConflictError } from "../../../../shared/core/errors";

describe("VehicleService", () => {
  let service: IVehicleService;
  let createVehicleUseCase: CreateVehicleUseCase;
  let newVehicleData: IVehicleDTO;

  beforeAll(() => {
    createVehicleUseCase = new CreateVehicleUseCase();
    service = new VehicleService(createVehicleUseCase);
  });

  beforeEach(() => {
    newVehicleData = {
      id: faker.string.uuid(),
      ownerId: faker.string.uuid(),
      licensePlate: faker.vehicle.vrm(),
      make: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      series: faker.string.alphanumeric(4),
      color: faker.vehicle.color(),
      type: faker.helpers.arrayElement(["Sedan", "SUV", "Truck", "Motorcycle"]),
      images: [faker.image.url(), faker.image.url()],
      stickerNumber: faker.string.alphanumeric(10),
      status: "REGISTERED",
      owner: null,
    };
  });

  it("should successfully create a vehicle", async () => {
    const mockCreateVehicle = jest.fn().mockResolvedValue(newVehicleData);
    createVehicleUseCase.execute = mockCreateVehicle;

    const result = await service.createVehicle({
      ownerId: newVehicleData.ownerId,
      licensePlate: newVehicleData.licensePlate,
      make: newVehicleData.make,
      model: newVehicleData.model,
      series: newVehicleData.series,
      color: newVehicleData.color,
      type: newVehicleData.type,
      images: newVehicleData.images,
      stickerNumber: newVehicleData.stickerNumber,
      status: newVehicleData.status,
    });

    expect(mockCreateVehicle).toHaveBeenCalledWith({
      ownerId: newVehicleData.ownerId,
      licensePlate: newVehicleData.licensePlate,
      make: newVehicleData.make,
      model: newVehicleData.model,
      series: newVehicleData.series,
      color: newVehicleData.color,
      type: newVehicleData.type,
      images: newVehicleData.images,
      stickerNumber: newVehicleData.stickerNumber,
      status: newVehicleData.status,
    });

    expect(result).toEqual(newVehicleData);
  });

  it("should throw ConflictError when vehicle with the same license plate already exists", async () => {
    const mockCreateVehicle = jest.fn().mockRejectedValue(
      new ConflictError("A vehicle with this license plate already exists.")
    );
    createVehicleUseCase.execute = mockCreateVehicle;

    await expect(service.createVehicle({
      ownerId: newVehicleData.ownerId,
      licensePlate: newVehicleData.licensePlate,
      make: newVehicleData.make,
      model: newVehicleData.model,
      series: newVehicleData.series,
      color: newVehicleData.color,
      type: newVehicleData.type,
      images: newVehicleData.images,
      stickerNumber: newVehicleData.stickerNumber,
      status: newVehicleData.status,
    })).rejects.toThrow(ConflictError);
  });

  it("should throw an error when vehicle creation fails", async () => {
    const mockCreateVehicle = jest.fn().mockRejectedValue(new Error("Vehicle creation failed."));
    createVehicleUseCase.execute = mockCreateVehicle;

    await expect(service.createVehicle({
      ownerId: newVehicleData.ownerId,
      licensePlate: newVehicleData.licensePlate,
      make: newVehicleData.make,
      model: newVehicleData.model,
      series: newVehicleData.series,
      color: newVehicleData.color,
      type: newVehicleData.type,
      images: newVehicleData.images,
      stickerNumber: newVehicleData.stickerNumber,
      status: newVehicleData.status,
    })).rejects.toThrow("Vehicle creation failed.");
  });
});
