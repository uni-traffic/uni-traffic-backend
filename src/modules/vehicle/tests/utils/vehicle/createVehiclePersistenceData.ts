import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { createUserPersistenceData } from "../../../../user/tests/utils/user/createUserPersistenceData";
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
  images = Array.from({ length: 3 }).map(() => faker.image.url()),
  stickerNumber = faker.number.bigInt({ min: 10_000_000, max: 99_999_999 }).toString(),
  isActive = faker.datatype.boolean(),
  createdAt = faker.date.past(),
  updatedAt = faker.date.past(),
  owner = createUserPersistenceData({})
}: Partial<IVehicleRawObject>): IVehicleRawObject => {
  return {
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
    owner
  };
};
