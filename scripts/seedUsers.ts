import type { Role } from "@prisma/client";
import { seedUser } from "../src/modules/user/tests/utils/user/seedUser";

import { db } from "../src/shared/infrastructure/database/prisma";

export const seedUserAccounts = async () => {
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
