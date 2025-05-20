import type { JSONObject } from "../../../../../../shared/lib/types";
import { Vehicle } from "../../../../src/domain/models/vehicle/classes/vehicle";
import type { IVehicleRawObject } from "../../../../src/domain/models/vehicle/constant";
import { VehicleFactory } from "../../../../src/domain/models/vehicle/factory";
import { createVehiclePersistenceData } from "../../../utils/vehicle/createVehiclePersistenceData";

describe("VehicleFactory", () => {
  let mockVehicleData: IVehicleRawObject;

  beforeEach(() => {
    mockVehicleData = createVehiclePersistenceData({});
  });

  it("should successfully create a Vehicle when all properties are valid", () => {
    const result = VehicleFactory.create({
      ...mockVehicleData,
      images: mockVehicleData.images as JSONObject,
      schoolMember: mockVehicleData.schoolMember as JSONObject,
      driver: mockVehicleData.driver as JSONObject
    });

    expect(result.isSuccess).toBe(true);

    const vehicle = result.getValue();

    expect(result.getValue()).toBeInstanceOf(Vehicle);
    expect(vehicle.id).toBe(mockVehicleData.id);
    expect(vehicle.ownerId).toBe(mockVehicleData.ownerId);
    expect(vehicle.licensePlate.value).toBe(mockVehicleData.licensePlate);
    expect(vehicle.make).toBe(mockVehicleData.make);
    expect(vehicle.model).toBe(mockVehicleData.model);
    expect(vehicle.series).toBe(mockVehicleData.series);
    expect(vehicle.color).toBe(mockVehicleData.color);
    expect(vehicle.type.value).toBe(mockVehicleData.type);
    expect(vehicle.stickerNumber.value).toBe(mockVehicleData.stickerNumber);
    expect(vehicle.status.value).toBe(mockVehicleData.status);
    expect(vehicle.createdAt).toBe(mockVehicleData.createdAt);
    expect(vehicle.updatedAt).toBe(mockVehicleData.updatedAt);
    expect(vehicle.owner).toBeDefined();
  });

  it("should not create a Vehicle when license plate is invalid", () => {
    const mockVehicleDataWithInvalidLicense = {
      ...mockVehicleData,
      licensePlate: ""
    };
    const result = VehicleFactory.create({
      ...mockVehicleDataWithInvalidLicense,
      images: mockVehicleDataWithInvalidLicense.images as JSONObject,
      schoolMember: mockVehicleDataWithInvalidLicense.schoolMember as JSONObject,
      driver: mockVehicleDataWithInvalidLicense.driver as JSONObject
    });

    expect(result.isSuccess).toBe(false);
    expect(result.getErrorMessage()).toContain("is not a valid license plate number");
  });

  it("should not create a Vehicle when sticker is invalid", () => {
    const mockVehicleDataWithInvalidSticker = {
      ...mockVehicleData,
      stickerNumber: ""
    };
    const result = VehicleFactory.create({
      ...mockVehicleDataWithInvalidSticker,
      images: mockVehicleDataWithInvalidSticker.images as JSONObject,
      schoolMember: mockVehicleDataWithInvalidSticker.schoolMember as JSONObject,
      driver: mockVehicleDataWithInvalidSticker.driver as JSONObject
    });

    expect(result.isSuccess).toBe(false);
    expect(result.getErrorMessage()).toContain("is not a valid sticker number");
  });
});
