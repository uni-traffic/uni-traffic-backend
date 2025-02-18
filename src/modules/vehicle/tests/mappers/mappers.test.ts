import { faker } from "@faker-js/faker";
import { VehicleMapper, type IVehicleMapper } from "../../src/domain/models/vehicle/mapper";
import { Vehicle } from "../../src/domain/models/vehicle/classes/vehicle";
import type { IUserRawObject } from "../../../user/src/domain/models/user/constant";
import { createVehicleDomainObject } from "../utils/vehicle/createVehicleDomainObject";

describe("VehicleMapper", () => {
  let vehicleMapper: IVehicleMapper;
  let mockUserData: IUserRawObject;

  beforeAll(() => {
    vehicleMapper = new VehicleMapper();
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
  });

  it("should map to domain from persistance data", () => {
    const vehicleSchemaObject = {
      id: faker.string.uuid(),
      ownerId: mockUserData.id,
      licenseNumber: "abc 1234",
      stickerNumber: "12345678",
      isActive: faker.datatype.boolean(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      owner: mockUserData
    };
    const vehicleDomainObject = vehicleMapper.toDomain(vehicleSchemaObject);

    expect(vehicleDomainObject).toBeInstanceOf(Vehicle);
    expect(vehicleDomainObject.id).toBe(vehicleSchemaObject.id);
    expect(vehicleDomainObject.ownerId).toBe(vehicleSchemaObject.ownerId);
    expect(vehicleDomainObject.licenseNumber.value).toBe(vehicleSchemaObject.licenseNumber);
    expect(vehicleDomainObject.stickerNumber.value).toBe(vehicleSchemaObject.stickerNumber);
    expect(vehicleDomainObject.isActive).toBe(vehicleSchemaObject.isActive);
    expect(vehicleDomainObject.createdAt).toBe(vehicleSchemaObject.createdAt);
    expect(vehicleDomainObject.updatedAt).toBe(vehicleSchemaObject.updatedAt);
    expect(vehicleDomainObject.owner!.id).toBe(vehicleSchemaObject.owner!.id);
    expect(vehicleDomainObject.owner!.username).toBe(vehicleSchemaObject.owner!.username);
    expect(vehicleDomainObject.owner!.firstName).toBe(vehicleSchemaObject.owner!.firstName);
    expect(vehicleDomainObject.owner!.lastName).toBe(vehicleSchemaObject.owner!.lastName);
    expect(vehicleDomainObject.owner!.email).toBe(vehicleSchemaObject.owner!.email);
    expect(vehicleDomainObject.owner!.role).toBe(vehicleSchemaObject.owner!.role);
  });

  it("should map to persistence from domain", () => {
    const vehicleDomainObject = createVehicleDomainObject({});
    const vehicleSchemaObject = vehicleMapper.toPersistence(vehicleDomainObject);

    expect(vehicleSchemaObject.id).toBe(vehicleDomainObject.id);
    expect(vehicleSchemaObject.ownerId).toBe(vehicleDomainObject.ownerId);
    expect(vehicleSchemaObject.licenseNumber).toBe(vehicleDomainObject.licenseNumber.value);
    expect(vehicleSchemaObject.stickerNumber).toBe(vehicleDomainObject.stickerNumber.value);
    expect(vehicleSchemaObject.isActive).toBe(vehicleDomainObject.isActive);
    expect(vehicleSchemaObject.createdAt).toBe(vehicleDomainObject.createdAt);
    expect(vehicleSchemaObject.updatedAt).toBe(vehicleDomainObject.updatedAt);
  });

  it("should map to DTO from domain", () => {
    const vehicleDomainObject = createVehicleDomainObject({});
    const vehicleDTO = vehicleMapper.toDTO(vehicleDomainObject);

    expect(vehicleDTO.id).toBe(vehicleDomainObject.id);
    expect(vehicleDTO.ownerId).toBe(vehicleDomainObject.ownerId);
    expect(vehicleDTO.licenseNumber).toBe(vehicleDomainObject.licenseNumber.value);
    expect(vehicleDTO.stickerNumber).toBe(vehicleDomainObject.stickerNumber.value);
    expect(vehicleDTO.isActive).toBe(vehicleDomainObject.isActive);
  });
});
