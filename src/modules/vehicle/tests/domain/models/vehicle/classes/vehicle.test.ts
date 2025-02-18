import { faker } from "@faker-js/faker";
import { Vehicle } from "../../../../../src/domain/models/vehicle/classes/vehicle";
import { VehicleLicensePlateNumber } from "../../../../../src/domain/models/vehicle/classes/vehicleLicenseNumber";
import { VehicleStickerNumber } from "../../../../../src/domain/models/vehicle/classes/vehicleStickerNumber";
import { createUserDomainObject } from "../../../../../../user/tests/utils/user/createUserDomainObject";
import type { IUserDTO } from "../../../../../../user/src/dtos/userDTO";
import { UserMapper } from "../../../../../../user/src/domain/models/user/mapper";

describe("Vehicle", () => {
  it("should create a vehicle", () => {
    const userDomainObject = createUserDomainObject({});
    const mockVehicleData: {
      id: string;
      ownerId: string;
      licenseNumber: VehicleLicensePlateNumber;
      stickerNumber: VehicleStickerNumber;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
      owner: IUserDTO;
    } = {
      id: faker.string.uuid(),
      ownerId: userDomainObject.id,
      licenseNumber: VehicleLicensePlateNumber.create("abcd 1234").getValue(),
      stickerNumber: VehicleStickerNumber.create("12345678").getValue(),
      isActive: faker.datatype.boolean(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      owner: new UserMapper().toDTO(userDomainObject)
    };

    const vehicle = Vehicle.create(mockVehicleData);

    expect(vehicle).toBeInstanceOf(Vehicle);
    expect(vehicle.id).toBe(mockVehicleData.id);
    expect(vehicle.ownerId).toBe(mockVehicleData.ownerId);
    expect(vehicle.licenseNumber).toBe(mockVehicleData.licenseNumber);
    expect(vehicle.stickerNumber).toBe(mockVehicleData.stickerNumber);
    expect(vehicle.isActive).toBe(mockVehicleData.isActive);
    expect(vehicle.createdAt).toBe(mockVehicleData.createdAt);
    expect(vehicle.updatedAt).toBe(mockVehicleData.updatedAt);
    expect(vehicle.owner).toBe(mockVehicleData.owner);
  });
});
