import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import type { IVehicle } from "../../../src/domain/models/vehicle/classes/vehicle";
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
  images = Array.from({ length: 3 }).map(() => faker.image.url()),
  stickerNumber = faker.number.bigInt({ min: 10_000_000, max: 99_999_999 }).toString(),
  isActive = faker.datatype.boolean(),
  createdAt = faker.date.past(),
  updatedAt = faker.date.past()
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
    stickerNumber,
    isActive,
    createdAt,
    updatedAt,
    owner: {
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
  });

  return vehicleOrError.getValue();
};
