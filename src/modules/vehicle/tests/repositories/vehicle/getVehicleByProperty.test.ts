import { db } from "../../../../../shared/infrastructure/database/prisma";
import type { JSONObject } from "../../../../../shared/lib/types";
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
  expect(received.id).toBe(expected.id);
  expect(received.status.value).toBe(expected.status);
  expect(received.licensePlate.value).toBe(expected.licensePlate);
  expect(received.make).toBe(expected.make);
  expect(received.model).toBe(expected.model);
  expect(received.series).toBe(expected.series);
  expect(received.color).toBe(expected.color);
  expect(received.type.value).toBe(expected.type);
  expect(received.images.toJSON()).toMatchObject(expected.images);
  expect(received.stickerNumber.value).toBe(expected.stickerNumber);
  expect(received.owner).toBeDefined();
};

describe("VehicleRepository.getVehicleByProperty", () => {
  let vehicleRepository: IVehicleRepository;

  beforeAll(() => {
    vehicleRepository = new VehicleRepository();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return Vehicle when the parameter is id", async () => {
    const seededVehicle = await seedVehicle({});
    const mockRequest: VehicleRequest = {
      id: seededVehicle.id
    };

    const vehicle = await vehicleRepository.getVehicleByProperty(mockRequest);

    expect(vehicle).not.toBeNull();
    assertVehicle(vehicle!, {
      ...seededVehicle,
      images: seededVehicle.images as JSONObject,
      driver: seededVehicle.driver as JSONObject,
      schoolMember: seededVehicle.schoolMember as JSONObject
    });
  });

  it("should return Vehicle when the parameter is licensePlate", async () => {
    const seededVehicle = await seedVehicle({});
    const mockRequest: VehicleRequest = {
      licensePlate: seededVehicle.licensePlate
    };

    const vehicle = await vehicleRepository.getVehicleByProperty(mockRequest);

    expect(vehicle).not.toBeNull();
    assertVehicle(vehicle!, {
      ...seededVehicle,
      images: seededVehicle.images as JSONObject,
      driver: seededVehicle.driver as JSONObject,
      schoolMember: seededVehicle.schoolMember as JSONObject
    });
  });

  it("should return Vehicle when the parameter is stickerNumber", async () => {
    const seededVehicle = await seedVehicle({});
    const mockRequest: VehicleRequest = {
      stickerNumber: seededVehicle.stickerNumber
    };

    const vehicle = await vehicleRepository.getVehicleByProperty(mockRequest);

    expect(vehicle).not.toBeNull();
    assertVehicle(vehicle!, {
      ...seededVehicle,
      images: seededVehicle.images as JSONObject,
      driver: seededVehicle.driver as JSONObject,
      schoolMember: seededVehicle.schoolMember as JSONObject
    });
  });

  it("should return null when no property is provided", async () => {
    const vehicle = await vehicleRepository.getVehicleByProperty({});

    expect(vehicle).toBeNull();
  });
});
