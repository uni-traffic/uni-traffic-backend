import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import type { IVehicleFactoryProps } from "../../../src/domain/models/vehicle/factory";
import type { IUserRawObject } from "../../../../user/src/domain/models/user/constant";

export const seedVehicle = async ({
  id = uuid(),
  owner, 
  licenseNumber = faker.vehicle.vrm(),
  stickerNumber = faker.number.bigInt({ min: 10_000_000, max: 99_999_999 }).toString(),
  isActive = faker.datatype.boolean(),
  createdAt = new Date(),
  updatedAt = new Date()
}: Partial<IVehicleFactoryProps> & { owner?: Partial<IUserRawObject> }) => {
  const ownerData = owner ? await seedUser(owner) : await seedUser({ role: "STUDENT" });

  return db.vehicle.create({
    data: {
      id,
      ownerId: ownerData.id,
      licenseNumber,
      stickerNumber,
      isActive,
      createdAt,
      updatedAt
    }
  });
};
