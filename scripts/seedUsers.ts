import type { Role } from "@prisma/client";
import { seedUser } from "../src/modules/user/tests/utils/user/seedUser";
import { db } from "../src/shared/infrastructure/database/prisma";

(async () => {
  const accounts = [
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
          in: accounts.map((account) => account.username)
        }
      }
    });

    for (const account of accounts) {
      await seedUser({
        username: account.username,
        password: account.password,
        role: account.role as Role
      });
    }

    console.log("SAVE THE FOLLOWING ACCOUNT DETAILS: ");
    console.table(accounts);
  } catch (error) {
    console.log(error);
  }
})();
