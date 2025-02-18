import { faker } from "@faker-js/faker";
import type { IUserRawObject } from "../../../../../user/src/domain/models/user/constant";
import { Vehicle } from "../../../../src/domain/models/vehicle/classes/vehicle";
import {
  type IVehicleFactoryProps,
  VehicleFactory
} from "../../../../src/domain/models/vehicle/factory";

describe("VehicleFactory", () => {
  let mockVehicleData: IVehicleFactoryProps;
  let mockUserData: IUserRawObject;

  beforeEach(() => {
    mockUserData = {
      id: faker.string.uuid(),
      username: faker.word.sample({ length: 15 }),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: faker.helpers.arrayElement(["STUDENT", "SECURITY", "ADMIN", "STAFF"]),
      isSuperAdmin: false,
      isDeleted: false,
      deletedAt: null,
      createdAt: faker.date.past(),
      updatedAt: faker.date.past()
    };
    mockVehicleData = {
      id: faker.string.uuid(),
      ownerId: mockUserData.id,
      licenseNumber: "abcd 1234",
      stickerNumber: "12345678",
      isActive: faker.datatype.boolean(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      owner: mockUserData
    };
  });

  it("should successfully create a Vehicle when all properties are valid", () => {
    const result = VehicleFactory.create(mockVehicleData);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(Vehicle);

    const vehicle = result.getValue();
    expect(vehicle.id).toBe(mockVehicleData.id);
    expect(vehicle.ownerId).toBe(mockVehicleData.ownerId);
    expect(vehicle.licenseNumber.value).toBe(mockVehicleData.licenseNumber);
    expect(vehicle.stickerNumber.value).toBe(mockVehicleData.stickerNumber);
    expect(vehicle.isActive).toBe(mockVehicleData.isActive);
    expect(vehicle.createdAt).toBe(mockVehicleData.createdAt);
    expect(vehicle.updatedAt).toBe(mockVehicleData.updatedAt);
    expect(vehicle.owner!.id).toBe(mockUserData.id);
    expect(vehicle.owner!.username).toBe(mockUserData.username);
    expect(vehicle.owner!.firstName).toBe(mockUserData.firstName);
    expect(vehicle.owner!.lastName).toBe(mockUserData.lastName);
    expect(vehicle.owner!.email).toBe(mockUserData.email);
    expect(vehicle.owner!.role).toBe(mockUserData.role);
  });

  it("should not create a Vehicle when license plate is invalid", () => {
    const mockVehicleDataWithInvalidLicense = {
      ...mockVehicleData,
      licenseNumber: ""
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
