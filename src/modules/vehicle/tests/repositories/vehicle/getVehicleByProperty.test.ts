import { type IVehicle, Vehicle } from "../../../src/domain/models/vehicle/classes/vehicle";
import type { IVehicleDTO } from "../../../src/dtos/vehicleDTO";
import type { VehicleRequest } from "../../../src/dtos/vehicleRequestSchema";
import {
  type IVehicleRepository,
  VehicleRepository
} from "../../../src/repositories/vehicleRepository";
import { seedVehicle } from "../../utils/vehicle/seedVehicle";

const assertVehicle = (received: IVehicle, expected: IVehicleDTO) => {
  expect(received).toBeInstanceOf(Vehicle);
  expect(received!.id).toBe(expected.id);
  expect(received!.isActive).toBe(expected.isActive);
  expect(received!.licensePlate.value).toBe(expected.licensePlate);
  expect(received.make).toBe(expected.make);
  expect(received.model).toBe(expected.model);
  expect(received.series).toBe(expected.series);
  expect(received.color).toBe(expected.color);
  expect(received.type.value).toBe(expected.type);
  expect(received.images.value).toStrictEqual(expected.images);
  expect(received!.stickerNumber.value).toBe(expected.stickerNumber);
  expect(received!.ownerId).toBe(expected.ownerId);
  expect(received!.owner.id).toBe(expected.owner.id);
  expect(received!.owner.role).toBe(expected.owner.role);
  expect(received!.owner.lastName).toBe(expected.owner.lastName);
  expect(received!.owner.firstName).toBe(expected.owner.firstName);
  expect(received!.owner.email).toBe(expected.owner.email);
  expect(received!.owner.username).toBe(expected.owner.username);
};

describe("VehicleRepository.getVehicleByProperty", () => {
  let vehicleRepository: IVehicleRepository;

  beforeAll(() => {
    vehicleRepository = new VehicleRepository();
  });

  it("should return Vehicle when the parameter is id", async () => {
    const seededVehicle = await seedVehicle({});
    const mockRequest: VehicleRequest = {
      id: seededVehicle.id
    };

    const vehicle = await vehicleRepository.getVehicleByProperty(mockRequest);

    expect(vehicle).not.toBeNull();
    assertVehicle(vehicle!, seededVehicle);
  });

  it("should return Vehicle when the parameter is licensePlate", async () => {
    const seededVehicle = await seedVehicle({});
    const mockRequest: VehicleRequest = {
      licensePlate: seededVehicle.licensePlate
    };

    const vehicle = await vehicleRepository.getVehicleByProperty(mockRequest);

    expect(vehicle).not.toBeNull();
    assertVehicle(vehicle!, seededVehicle);
  });

  it("should return Vehicle when the parameter is stickerNumber", async () => {
    const seededVehicle = await seedVehicle({});
    const mockRequest: VehicleRequest = {
      stickerNumber: seededVehicle.stickerNumber
    };

    const vehicle = await vehicleRepository.getVehicleByProperty(mockRequest);

    expect(vehicle).not.toBeNull();
    assertVehicle(vehicle!, seededVehicle);
  });

  it("should return null when no property is provided", async () => {
    const vehicle = await vehicleRepository.getVehicleByProperty({});

    expect(vehicle).toBeNull();
  });
});
