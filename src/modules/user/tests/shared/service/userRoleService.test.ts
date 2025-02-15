import { faker } from "@faker-js/faker";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import {
  type IUserRoleService,
  UserRoleService
} from "../../../src/shared/service/userRoleService";
import { seedUser } from "../../utils/user/seedUser";

describe("UserRoleService", () => {
  let userRoleService: IUserRoleService;

  beforeAll(() => {
    userRoleService = new UserRoleService();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  it("should return true when user has the specified role", async () => {
    const seededUser = await seedUser({});

    const hasRole = await userRoleService.hasRole(seededUser.id, seededUser.role);

    expect(hasRole).toBe(true);
  });

  it("should return false when user doesn't have the specified role", async () => {
    const seededUser = await seedUser({ role: faker.helpers.arrayElement(["STUDENT", "STAFF"]) });

    const hasRole = await userRoleService.hasRole(seededUser.id, "ADMIN");

    expect(hasRole).toBe(false);
  });

  it("should return true when user has ADMIN role", async () => {
    const seededUser = await seedUser({ role: "ADMIN" });

    const hasRole = await userRoleService.hasAdminRole(seededUser.id);

    expect(hasRole).toBe(true);
  });

  it("should return false when user doesn't have ADMIN role", async () => {
    const seededUser = await seedUser({ role: faker.helpers.arrayElement(["STUDENT", "STAFF"]) });

    const hasRole = await userRoleService.hasAdminRole(seededUser.id);

    expect(hasRole).toBe(false);
  });

  it("should return true when user has SECURITY role", async () => {
    const seededUser = await seedUser({ role: "SECURITY" });

    const hasRole = await userRoleService.hasSecurityRole(seededUser.id);

    expect(hasRole).toBe(true);
  });

  it("should return false when user doesn't have ADMIN role", async () => {
    const seededUser = await seedUser({ role: faker.helpers.arrayElement(["STUDENT", "STAFF"]) });

    const hasRole = await userRoleService.hasSecurityRole(seededUser.id);

    expect(hasRole).toBe(false);
  });
});
