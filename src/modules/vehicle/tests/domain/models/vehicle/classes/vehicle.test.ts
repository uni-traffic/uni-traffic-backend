import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { Driver } from "../../../../../../../shared/domain/classes/vehicle/driver";
import { SchoolMember } from "../../../../../../../shared/domain/classes/vehicle/schoolMember";
import { VehicleImages } from "../../../../../../../shared/domain/classes/vehicle/vehicleImages";
import { UserMapper } from "../../../../../../user/src/domain/models/user/mapper";
import { createUserDomainObject } from "../../../../../../user/tests/utils/user/createUserDomainObject";
import { type IVehicle, Vehicle } from "../../../../../src/domain/models/vehicle/classes/vehicle";
import { VehicleLicensePlateNumber } from "../../../../../src/domain/models/vehicle/classes/vehicleLicensePlate";
import { VehicleStatus } from "../../../../../src/domain/models/vehicle/classes/vehicleStatus";
import { VehicleStickerNumber } from "../../../../../src/domain/models/vehicle/classes/vehicleStickerNumber";
import { VehicleType } from "../../../../../src/domain/models/vehicle/classes/vehicleType";

describe("Vehicle", () => {
  it("should create a vehicle", () => {
    const userDomainObject = createUserDomainObject({});
    const mockVehicleData: IVehicle = {
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
      status: VehicleStatus.create("REGISTERED").getValue(),
      images: new VehicleImages({
        front: faker.image.url(),
        side: faker.image.url(),
        back: faker.image.url()
      }),
      driver: new Driver({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        licenseId: faker.string.uuid(),
        licenseImage: faker.image.url(),
        selfiePicture: faker.image.url()
      }),
      schoolMember: new SchoolMember({
        schoolId: uuid(),
        lastName: faker.person.lastName(),
        firstName: faker.person.firstName(),
        type: faker.helpers.arrayElement(["STUDENT", "STAFF"]),
        schoolCredential: faker.string.uuid()
      }),
      stickerNumber: VehicleStickerNumber.create("12345678").getValue(),
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
    expect(vehicle.stickerNumber).toBe(mockVehicleData.stickerNumber);
    expect(vehicle.status.value).toBe(mockVehicleData.status.value);
    expect(vehicle.createdAt).toBe(mockVehicleData.createdAt);
    expect(vehicle.updatedAt).toBe(mockVehicleData.updatedAt);
    expect(vehicle.owner).toBe(mockVehicleData.owner);

    // JSON
    expect(mockVehicleData.driver).toStrictEqual(vehicle.driver);
    expect(mockVehicleData.schoolMember).toStrictEqual(vehicle.schoolMember);
    expect(mockVehicleData.images).toStrictEqual(vehicle.images);
  });
});
