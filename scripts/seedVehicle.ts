import type { Role } from "@prisma/client";
import { seedUser } from "../src/modules/user/tests/utils/user/seedUser";
import { seedVehicle } from "../src/modules/vehicle/tests/utils/vehicle/seedVehicle";
import { db } from "../src/shared/infrastructure/database/prisma";

export const seedVehicleAndOwnerData = async () => {
  const OWNER_DATA = [
    {
      username: "french.montajes",
      email: "frenchanthony.montajes@neu.edu.ph",
      password: "robee123",
      lastName: "Montajes",
      firstName: "French Anthony",
      role: "STUDENT"
    },
    {
      username: "robee.herrera",
      email: "angelorobee.herrera@neu.edu.ph",
      password: "robee123",
      lastName: "Herrera",
      firstName: "TJ Anthony",
      role: "STUDENT"
    }
  ];

  const VEHICLE_DATA = [
    {
      licensePlate: "959CIP",
      make: "YAMAHA",
      model: "2020",
      series: "MIO SPORTY",
      color: "MATTE BLACK",
      images: [
        "https://imgur.com/a/4RBvnfb",
        "https://imgur.com/iNjIPto",
        "https://imgur.com/FWm1zVe"
      ],
      stickerNumber: "20250125",
      type: "MOTORCYCLE",
      isActive: true
    },
    {
      licensePlate: "DBA4658",
      make: "MITSUBISHI",
      model: "2020",
      series: "MONTERO SPORT",
      color: "WHITE",
      images: [],
      stickerNumber: "20250126",
      type: "CAR",
      isActive: true
    }
  ];

  try {
    await db.user.deleteMany({
      where: {
        username: {
          in: OWNER_DATA.map((owner) => owner.username)
        }
      }
    });
    await db.vehicle.deleteMany({
      where: {
        OR: [
          {
            licensePlate: {
              in: VEHICLE_DATA.map((vehicle) => vehicle.licensePlate)
            }
          },
          {
            stickerNumber: {
              in: VEHICLE_DATA.map((vehicle) => vehicle.stickerNumber)
            }
          }
        ]
      }
    });
  } catch (error) {
    console.log(error);
  }

  try {
    const seededUsers = await Promise.all(
      OWNER_DATA.map(async (user) => {
        return await seedUser({
          ...user,
          role: user.role as Role
        });
      })
    );
    const seededVehicles = await Promise.all(
      VEHICLE_DATA.map(async (vehicle, index) => {
        return await seedVehicle({
          ...vehicle,
          ownerId: seededUsers[index].id
        });
      })
    );

    console.table([
      {
        id: seededVehicles[0].id,
        licensePlate: seededVehicles[0].licensePlate,
        stickerNumber: seededVehicles[0].stickerNumber
      },
      {
        id: seededVehicles[1].id,
        licensePlate: seededVehicles[1].licensePlate,
        stickerNumber: seededVehicles[1].stickerNumber
      }
    ]);
  } catch (error) {
    console.log(error);
  }
};
