import { faker } from "@faker-js/faker";
import { defaultTo } from "rambda";
import { v4 as uuid } from "uuid";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import type { IUserRawObject } from "../../../../user/src/domain/models/user/constant";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import type { IVehicleFactoryProps } from "../../../src/domain/models/vehicle/factory";

export const seedVehicle = async ({
  id = uuid(),
  licenseNumber = faker.vehicle.vrm(),
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
      licenseNumber,
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
