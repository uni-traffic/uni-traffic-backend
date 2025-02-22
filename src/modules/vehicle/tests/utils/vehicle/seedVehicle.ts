import { faker } from "@faker-js/faker";
import type { VehicleType as VehicleTypeSchema } from "@prisma/client";
import { defaultTo } from "rambda";
import { v4 as uuid } from "uuid";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import type { IUserRawObject } from "../../../../user/src/domain/models/user/constant";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import { VehicleType } from "../../../src/domain/models/vehicle/classes/vehicleType";
import type { IVehicleFactoryProps } from "../../../src/domain/models/vehicle/factory";

export const seedVehicle = async ({
  id = uuid(),
  licensePlate = faker.vehicle.vrm().toUpperCase(),
  make = faker.vehicle.manufacturer(),
  model = faker.date.past().getFullYear().toString(),
  series = faker.vehicle.model(),
  color = faker.vehicle.color(),
  type = faker.helpers.arrayElement(VehicleType.validVehicleTypes),
  images = Array.from({ length: 3 }).map(() => faker.image.url()),
  stickerNumber = faker.number.bigInt({ min: 10_000_000, max: 99_999_999 }).toString(),
  isActive = faker.datatype.boolean(),
  createdAt = new Date(),
  updatedAt = new Date(),
  ownerId
}: Partial<IVehicleFactoryProps> & { owner?: Partial<IUserRawObject> }) => {
  return db.vehicle.create({
    data: {
      id,
      ownerId: defaultTo((await seedUser({})).id, ownerId),
      licensePlate: licensePlate?.toUpperCase(),
      make,
      model,
      series,
      color,
      type: type as VehicleTypeSchema,
      images: images,
      stickerNumber,
      isActive,
      createdAt,
      updatedAt
    },
    include: {
      owner: true
    }
  });
};
