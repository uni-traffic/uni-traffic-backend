import type { Role } from "@prisma/client";
import { seedUser } from "../src/modules/user/tests/utils/user/seedUser";
import { seedVehicle } from "../src/modules/vehicle/tests/utils/vehicle/seedVehicle";
import { db } from "../src/shared/infrastructure/database/prisma";

const seedUserAccounts = async () => {
  const ACCOUNT_DETAILS = [
    {
      username: "admin",
      password: "admin123",
      role: "ADMIN"
    },
    {
      username: "security",
      password: "security123",
      role: "SECURITY"
    },
    {
      username: "staff",
      password: "staff123",
      role: "STAFF"
    },
    {
      username: "student",
      password: "student123",
      role: "STUDENT"
    }
  ];

  try {
    await db.user.deleteMany({
      where: {
        username: {
          in: ACCOUNT_DETAILS.map((account) => account.username)
        }
      }
    });

    for (const accountDetails of ACCOUNT_DETAILS) {
      await seedUser({
        ...accountDetails,
        role: accountDetails.role as Role
      });
    }

    console.log("SAVE THE FOLLOWING ACCOUNT DETAILS: ");
    console.table(ACCOUNT_DETAILS);
  } catch (error) {
    console.log(error);
  }
};

const seedVehicleAndOwnerData = async () => {
  const OWNER_DATA = {
    username: "french.montajes",
    password: "french.montajes",
    lastName: "Montajes",
    firstName: "French Anthony",
    role: "STUDENT"
  };

  const VEHICLE_DATA = {
    licenseNumber: "959CIP",
    stickerNumber: "20250125"
  };

  try {
    await db.user.deleteMany({
      where: {
        username: OWNER_DATA.username
      }
    });
    await db.vehicle.deleteMany({
      where: {
        OR: [
          {
            licenseNumber: VEHICLE_DATA.licenseNumber
          },
          {
            stickerNumber: VEHICLE_DATA.stickerNumber
          }
        ]
      }
    });

    const seededUser = await seedUser({
      ...OWNER_DATA,
      role: OWNER_DATA.role as Role
    });
    const seededVehicle = await seedVehicle({
      ...VEHICLE_DATA,
      ownerId: seededUser.id
    });

    console.table({
      id: seededVehicle.id,
      licensePlate: seededVehicle.licenseNumber,
      stickerNumber: seededVehicle.stickerNumber
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await seedUserAccounts();
  await seedVehicleAndOwnerData();
})();
