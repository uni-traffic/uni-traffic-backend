import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import type { IVehicle } from "../../../src/domain/models/vehicle/classes/vehicle";
import { VehicleStatus } from "../../../src/domain/models/vehicle/classes/vehicleStatus";
import {
  type IVehicleFactoryProps,
  VehicleFactory
} from "../../../src/domain/models/vehicle/factory";

export const createVehicleDomainObject = ({
  id = uuid(),
  ownerId = uuid(),
  licensePlate = faker.vehicle.vrm(),
  make = faker.vehicle.manufacturer(),
  model = faker.date.past().getFullYear().toString(),
  series = faker.vehicle.model(),
  color = faker.vehicle.color(),
  type = faker.helpers.arrayElement(["CAR", "MOTORCYCLE"]),
  stickerNumber = faker.number.bigInt({ min: 10_000_000, max: 99_999_999 }).toString(),
  status = faker.helpers.arrayElement(VehicleStatus.validVehicleStatus),
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
  owner = {
    id: ownerId,
    username: faker.word.sample({ length: 15 }),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: faker.helpers.arrayElement(["STUDENT", "STAFF"]),
    isSuperAdmin: false,
    isDeleted: false,
    deletedAt: null,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past()
  }
}: Partial<IVehicleFactoryProps>): IVehicle => {
  const vehicleOrError = VehicleFactory.create({
    id,
    ownerId,
    licensePlate,
    make,
    model,
    series,
    color,
    type,
    images,
    status,
    stickerNumber,
    createdAt,
    updatedAt,
    driver,
    schoolMember,
    owner
  });

  return vehicleOrError.getValue();
};
