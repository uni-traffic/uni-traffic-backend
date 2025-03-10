import { Vehicle } from "../../../../src/domain/models/vehicle/classes/vehicle";
import {
  type IVehicleFactoryProps,
  VehicleFactory
} from "../../../../src/domain/models/vehicle/factory";
import { createVehiclePersistenceData } from "../../../utils/vehicle/createVehiclePersistenceData";

describe("VehicleFactory", () => {
  let mockVehicleData: IVehicleFactoryProps;

  beforeEach(() => {
    mockVehicleData = createVehiclePersistenceData({});
  });

  it("should successfully create a Vehicle when all properties are valid", () => {
    const result = VehicleFactory.create(mockVehicleData);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(Vehicle);

    const vehicle = result.getValue();

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
    expect(vehicle.owner!.id).toBe(mockVehicleData.owner!.id);
    expect(vehicle.owner!.username).toBe(mockVehicleData.owner!.username);
    expect(vehicle.owner!.firstName).toBe(mockVehicleData.owner!.firstName);
    expect(vehicle.owner!.lastName).toBe(mockVehicleData.owner!.lastName);
    expect(vehicle.owner!.email).toBe(mockVehicleData.owner!.email);
    expect(vehicle.owner!.role).toBe(mockVehicleData.owner!.role);
  });

  it("should not create a Vehicle when license plate is invalid", () => {
    const mockVehicleDataWithInvalidLicense = {
      ...mockVehicleData,
      licensePlate: ""
    };
    const result = VehicleFactory.create(mockVehicleDataWithInvalidLicense);

    expect(result.isSuccess).toBe(false);
    expect(result.getErrorMessage()).toContain("is not a valid license plate number");
  });

  it("should not create a Vehicle when license plate is invalid", () => {
    const mockVehicleDataWithInvalidSticker = {
      ...mockVehicleData,
      stickerNumber: "1234567"
    };
    const result = VehicleFactory.create(mockVehicleDataWithInvalidSticker);

    expect(result.isSuccess).toBe(false);
    expect(result.getErrorMessage()).toContain("is not a valid sticker number");
  });
});
