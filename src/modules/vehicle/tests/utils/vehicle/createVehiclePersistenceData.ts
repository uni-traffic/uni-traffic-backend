import { faker } from "@faker-js/faker";
import type { VehicleStatus as VehicleStatusEnum } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { createUserPersistenceData } from "../../../../user/tests/utils/user/createUserPersistenceData";
import { VehicleStatus } from "../../../src/domain/models/vehicle/classes/vehicleStatus";
import type { IVehicleRawObject } from "../../../src/domain/models/vehicle/constant";

export const createVehiclePersistenceData = ({
  id = uuid(),
  ownerId = uuid(),
  licensePlate = faker.vehicle.vrm(),
  make = faker.vehicle.manufacturer(),
  model = faker.date.past().getFullYear().toString(),
  series = faker.vehicle.model(),
  color = faker.vehicle.color(),
  type = faker.helpers.arrayElement(["CAR", "MOTORCYCLE"]),
  stickerNumber = faker.number.bigInt({ min: 10_000_000, max: 99_999_999 }).toString(),
  status = faker.helpers.arrayElement(VehicleStatus.validVehicleStatus) as VehicleStatusEnum,
  createdAt = faker.date.past(),
  updatedAt = faker.date.past(),
  images = {
    front: faker.image.url(),
    side: faker.image.url(),
    back: faker.image.url(),
    receipt: faker.image.url(),
    registration: faker.image.url()
  },
  driver = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    licenseId: faker.string.uuid(),
    licenseImage: faker.image.url(),
    selfiePicture: faker.image.url()
  },
  schoolMember = {
    schoolId: uuid(),
    lastName: faker.person.lastName(),
    firstName: faker.person.firstName(),
    type: faker.helpers.arrayElement(["STUDENT", "STAFF"]),
    schoolCredential: faker.string.uuid()
  },
  owner
}: Partial<IVehicleRawObject>): IVehicleRawObject => {
  const mockOwner = createUserPersistenceData({ id: ownerId });

  return {
    id,
    ownerId,
    licensePlate,
    make,
    model,
    series,
    color,
    type,
    schoolMember,
    driver,
    images,
    stickerNumber,
    status,
    createdAt,
    updatedAt,
    owner: owner ? owner : mockOwner
  };
};
