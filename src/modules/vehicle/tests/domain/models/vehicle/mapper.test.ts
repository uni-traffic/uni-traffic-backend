import { faker } from "@faker-js/faker";
import type { IUserRawObject } from "../../../../../user/src/domain/models/user/constant";
import { Vehicle } from "../../../../src/domain/models/vehicle/classes/vehicle";
import { type IVehicleMapper, VehicleMapper } from "../../../../src/domain/models/vehicle/mapper";
import { createVehicleDomainObject } from "../../../utils/vehicle/createVehicleDomainObject";

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

  it("should map to domain from persistence data", () => {
    const mockVehiclePersistenceData = {
      id: faker.string.uuid(),
      ownerId: mockUserData.id,
      licenseNumber: "abc 1234",
      stickerNumber: "12345678",
      isActive: faker.datatype.boolean(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      owner: mockUserData
    };
    const vehicleDomainObject = vehicleMapper.toDomain(mockVehiclePersistenceData);

    expect(vehicleDomainObject).toBeInstanceOf(Vehicle);
    expect(vehicleDomainObject.id).toBe(mockVehiclePersistenceData.id);
    expect(vehicleDomainObject.ownerId).toBe(mockVehiclePersistenceData.ownerId);
    expect(vehicleDomainObject.licenseNumber.value).toBe(mockVehiclePersistenceData.licenseNumber);
    expect(vehicleDomainObject.stickerNumber.value).toBe(mockVehiclePersistenceData.stickerNumber);
    expect(vehicleDomainObject.isActive).toBe(mockVehiclePersistenceData.isActive);
    expect(vehicleDomainObject.createdAt).toBe(mockVehiclePersistenceData.createdAt);
    expect(vehicleDomainObject.updatedAt).toBe(mockVehiclePersistenceData.updatedAt);
    expect(vehicleDomainObject.owner!.id).toBe(mockVehiclePersistenceData.owner!.id);
    expect(vehicleDomainObject.owner!.username).toBe(mockVehiclePersistenceData.owner!.username);
    expect(vehicleDomainObject.owner!.firstName).toBe(mockVehiclePersistenceData.owner!.firstName);
    expect(vehicleDomainObject.owner!.lastName).toBe(mockVehiclePersistenceData.owner!.lastName);
    expect(vehicleDomainObject.owner!.email).toBe(mockVehiclePersistenceData.owner!.email);
    expect(vehicleDomainObject.owner!.role).toBe(mockVehiclePersistenceData.owner!.role);
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
    expect(vehicleDTO.owner).toStrictEqual(vehicleDomainObject.owner);
  });
});
