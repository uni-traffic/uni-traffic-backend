import { Vehicle } from "../../../../src/domain/models/vehicle/classes/vehicle";
import { type IVehicleMapper, VehicleMapper } from "../../../../src/domain/models/vehicle/mapper";
import { createVehicleDomainObject } from "../../../utils/vehicle/createVehicleDomainObject";
import { createVehiclePersistenceData } from "../../../utils/vehicle/createVehiclePersistenceData";

describe("VehicleMapper", () => {
  let vehicleMapper: IVehicleMapper;

  beforeAll(() => {
    vehicleMapper = new VehicleMapper();
  });

  it("should map to domain from persistence data", () => {
    const mockVehiclePersistenceData = createVehiclePersistenceData({});
    const vehicleDomainObject = vehicleMapper.toDomain(mockVehiclePersistenceData);

    expect(vehicleDomainObject).toBeInstanceOf(Vehicle);
    expect(vehicleDomainObject.id).toBe(mockVehiclePersistenceData.id);
    expect(vehicleDomainObject.ownerId).toBe(mockVehiclePersistenceData.ownerId);
    expect(vehicleDomainObject.licensePlate.value).toBe(mockVehiclePersistenceData.licensePlate);
    expect(vehicleDomainObject.make).toBe(mockVehiclePersistenceData.make);
    expect(vehicleDomainObject.model).toBe(mockVehiclePersistenceData.model);
    expect(vehicleDomainObject.series).toBe(mockVehiclePersistenceData.series);
    expect(vehicleDomainObject.color).toBe(mockVehiclePersistenceData.color);
    expect(vehicleDomainObject.type.value).toBe(mockVehiclePersistenceData.type);
    expect(vehicleDomainObject.status.value).toBe(mockVehiclePersistenceData.status);
    expect(vehicleDomainObject.createdAt).toBe(mockVehiclePersistenceData.createdAt);
    expect(vehicleDomainObject.updatedAt).toBe(mockVehiclePersistenceData.updatedAt);
    expect(vehicleDomainObject.stickerNumber.value).toBe(mockVehiclePersistenceData.stickerNumber);

    // JSON
    expect(vehicleDomainObject.driver.toJSON()).toEqual(mockVehiclePersistenceData.driver);
    expect(vehicleDomainObject.schoolMember.toJSON()).toEqual(
      mockVehiclePersistenceData.schoolMember
    );
    expect(vehicleDomainObject.images.toJSON()).toEqual(mockVehiclePersistenceData.images);

    // User
    expect(vehicleDomainObject.owner!.id).toBe(mockVehiclePersistenceData.owner!.id);
    expect(vehicleDomainObject.owner!.username).toBe(mockVehiclePersistenceData.owner!.username);
    expect(vehicleDomainObject.owner!.firstName).toBe(mockVehiclePersistenceData.owner!.firstName);
    expect(vehicleDomainObject.owner!.lastName).toBe(mockVehiclePersistenceData.owner!.lastName);
    expect(vehicleDomainObject.owner!.email).toBe(mockVehiclePersistenceData.owner!.email);
    expect(vehicleDomainObject.owner!.role).toBe(mockVehiclePersistenceData.owner!.role);
  });

  it("should map to persistence from domain", () => {
    const vehicleDomainObject = createVehicleDomainObject({});
    const vehiclePersistenceObject = vehicleMapper.toPersistence(vehicleDomainObject);

    expect(vehiclePersistenceObject.id).toBe(vehicleDomainObject.id);
    expect(vehiclePersistenceObject.ownerId).toBe(vehicleDomainObject.ownerId);
    expect(vehiclePersistenceObject.licensePlate).toBe(vehicleDomainObject.licensePlate.value);
    expect(vehiclePersistenceObject.make).toBe(vehicleDomainObject.make);
    expect(vehiclePersistenceObject.model).toBe(vehicleDomainObject.model);
    expect(vehiclePersistenceObject.series).toBe(vehicleDomainObject.series);
    expect(vehiclePersistenceObject.color).toBe(vehicleDomainObject.color);
    expect(vehiclePersistenceObject.type).toBe(vehicleDomainObject.type.value);
    expect(vehiclePersistenceObject.stickerNumber).toBe(vehicleDomainObject.stickerNumber.value);
    expect(vehiclePersistenceObject.status).toBe(vehicleDomainObject.status.value);
    expect(vehiclePersistenceObject.createdAt).toBe(vehicleDomainObject.createdAt);
    expect(vehiclePersistenceObject.updatedAt).toBe(vehicleDomainObject.updatedAt);

    // JSON
    expect(vehiclePersistenceObject.driver).toEqual(vehicleDomainObject.driver.toJSON());
    expect(vehiclePersistenceObject.schoolMember).toEqual(
      vehicleDomainObject.schoolMember.toJSON()
    );
    expect(vehiclePersistenceObject.images).toEqual(vehicleDomainObject.images.toJSON());
  });

  it("should map to DTO from domain", () => {
    const vehicleDomainObject = createVehicleDomainObject({});
    const vehicleDTO = vehicleMapper.toDTO(vehicleDomainObject);

    expect(vehicleDTO.id).toBe(vehicleDomainObject.id);
    expect(vehicleDTO.ownerId).toBe(vehicleDomainObject.ownerId);
    expect(vehicleDTO.licensePlate).toBe(vehicleDomainObject.licensePlate.value);
    expect(vehicleDTO.make).toBe(vehicleDomainObject.make);
    expect(vehicleDTO.model).toBe(vehicleDomainObject.model);
    expect(vehicleDTO.series).toBe(vehicleDomainObject.series);
    expect(vehicleDTO.color).toBe(vehicleDomainObject.color);
    expect(vehicleDTO.type).toBe(vehicleDomainObject.type.value);
    expect(vehicleDTO.stickerNumber).toBe(vehicleDomainObject.stickerNumber.value);
    expect(vehicleDTO.status).toBe(vehicleDomainObject.status.value);
    expect(vehicleDTO.owner).toStrictEqual(vehicleDomainObject.owner);

    // JSON
    expect(vehicleDTO.driver).toEqual(vehicleDomainObject.driver.toJSON());
    expect(vehicleDTO.schoolMember).toEqual(vehicleDomainObject.schoolMember.toJSON());
    expect(vehicleDTO.images).toEqual(vehicleDomainObject.images.toJSON());
  });
});
