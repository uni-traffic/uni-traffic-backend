import { faker } from "@faker-js/faker";
import { UserMapper } from "../../../../../../user/src/domain/models/user/mapper";
import type { IUserDTO } from "../../../../../../user/src/dtos/userDTO";
import { createUserDomainObject } from "../../../../../../user/tests/utils/user/createUserDomainObject";
import { Vehicle } from "../../../../../src/domain/models/vehicle/classes/vehicle";
import { VehicleImages } from "../../../../../src/domain/models/vehicle/classes/vehicleImages";
import { VehicleLicensePlateNumber } from "../../../../../src/domain/models/vehicle/classes/vehicleLicensePlate";
import { VehicleStickerNumber } from "../../../../../src/domain/models/vehicle/classes/vehicleStickerNumber";
import { VehicleType } from "../../../../../src/domain/models/vehicle/classes/vehicleType";

describe("Vehicle", () => {
  it("should create a vehicle", () => {
    const userDomainObject = createUserDomainObject({});
    const mockVehicleData: {
      id: string;
      ownerId: string;
      licensePlate: VehicleLicensePlateNumber;
      make: string;
      model: string;
      series: string;
      color: string;
      type: VehicleType;
      images: VehicleImages;
      stickerNumber: VehicleStickerNumber;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
      owner: IUserDTO;
    } = {
      id: faker.string.uuid(),
      ownerId: userDomainObject.id,
      licensePlate: VehicleLicensePlateNumber.create("abcd 1234").getValue(),
      make: faker.vehicle.manufacturer(),
      model: faker.date.past().getFullYear().toString(),
      series: faker.vehicle.model(),
      color: faker.vehicle.color(),
      type: VehicleType.create(
        faker.helpers.arrayElement(VehicleType.validVehicleTypes)
      ).getValue(),
      images: VehicleImages.create(
        Array.from({ length: 3 }).map(() => faker.image.url())
      ).getValue(),
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
    expect(vehicle.licensePlate).toBe(mockVehicleData.licensePlate);
    expect(vehicle.make).toBe(mockVehicleData.make);
    expect(vehicle.model).toBe(mockVehicleData.model);
    expect(vehicle.series).toBe(mockVehicleData.series);
    expect(vehicle.color).toBe(mockVehicleData.color);
    expect(vehicle.type.value).toBe(mockVehicleData.type.value);
    expect(vehicle.images.value).toBe(mockVehicleData.images.value);
    expect(vehicle.stickerNumber).toBe(mockVehicleData.stickerNumber);
    expect(vehicle.isActive).toBe(mockVehicleData.isActive);
    expect(vehicle.createdAt).toBe(mockVehicleData.createdAt);
    expect(vehicle.updatedAt).toBe(mockVehicleData.updatedAt);
    expect(vehicle.owner).toBe(mockVehicleData.owner);
  });
});
