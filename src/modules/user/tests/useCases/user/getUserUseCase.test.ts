import { NotFoundError } from "../../../../../shared/core/errors";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import type { GetUserRequest } from "../../../src/dtos/userRequestSchema";
import { GetUserUseCase } from "../../../src/useCases/user/getUserUseCase";
import { seedUser } from "../../utils/user/seedUser";

describe("GetUserByPropertyUseCase", () => {
  let getUser: GetUserUseCase;

  beforeAll(async () => {
    getUser = new GetUserUseCase();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  it("should return User that match the given id", async () => {
    const seededUser = await seedUser({});

    const result = await getUser.execute({
      id: seededUser.id,
      count: "1",
      page: "1"
    });

    expect(result.user.length).toBe(1);
    expect(result.user[0].id).toBe(seededUser.id);
    expect(result.user[0].email).toBe(seededUser.email);
    expect(result.user[0].firstName).toBe(seededUser.firstName);
    expect(result.user[0].lastName).toBe(seededUser.lastName);
    expect(result.user[0].role).toBe(seededUser.role);
    expect(result.user[0].username).toBe(seededUser.username);
  });

  it("should return 5 users", async () => {
    await seedUser({});
    await seedUser({});
    await seedUser({});
    await seedUser({});
    await seedUser({});

    const result = await getUser.execute({
      count: "5",
      page: "1"
    });

    expect(result.user.length).toBe(5);
  });

  it("should return User when the parameter is first name", async () => {
    const seededUser = await seedUser({ firstName: "Robs" });
    const seededUser1 = await seedUser({ firstName: "Robs" });
    const seededUser2 = await seedUser({ firstName: "Angelo" });

    const result = await getUser.execute({
      firstName: seededUser.firstName,
      count: "2",
      page: "1"
    });

    const mappedUser = result.user.map((users) => users.id);

    expect(result).not.toBe([]);
    expect(result.user.length).toBe(2);
    expect(mappedUser).toContain(seededUser.id);
    expect(mappedUser).toContain(seededUser1.id);
    expect(mappedUser).not.toContain(seededUser2.id);
  });

  it("should return User when the parameter is last name", async () => {
    const seededUser = await seedUser({ lastName: "Herrera" });
    const seededUser1 = await seedUser({ lastName: "Herrera" });
    const seededUser2 = await seedUser({ lastName: "Montajes" });
    const seededUser3 = await seedUser({ lastName: "Yumul" });
    const seededUser4 = await seedUser({ lastName: "Ramos" });

    const result = await getUser.execute({
      lastName: seededUser.lastName,
      count: "2",
      page: "1"
    });

    const mappedUser = result.user.map((users) => users.id);

    expect(result).not.toBe([]);
    expect(result.user.length).toBe(2);
    expect(mappedUser).toContain(seededUser.id);
    expect(mappedUser).toContain(seededUser1.id);
    expect(mappedUser).not.toContain(seededUser2.id);
    expect(mappedUser).not.toContain(seededUser3.id);
    expect(mappedUser).not.toContain(seededUser4.id);
  });

  it("should return User when the parameter is email", async () => {
    const seededUser = await seedUser({});
    const seededUser1 = await seedUser({});

    const result = await getUser.execute({
      email: seededUser.email,
      count: "1",
      page: "1"
    });

    expect(result).not.toBe([]);
    expect(result.user.length).toBe(1);
    expect(result.user[0].id).toBe(seededUser.id);
    expect(result.user[0]).not.toBe(seededUser1.id);
  });

  it("should return User when the parameter is role", async () => {
    const seededUser1 = await seedUser({ role: "ADMIN" });
    const seededUser2 = await seedUser({ role: "ADMIN" });
    const seededUser3 = await seedUser({ role: "ADMIN" });
    const seededUser4 = await seedUser({ role: "STAFF" });
    const seededUser5 = await seedUser({ role: "STUDENT" });
    const seededUser6 = await seedUser({ role: "SECURITY" });

    const result = await getUser.execute({
      role: "ADMIN",
      count: "3",
      page: "1"
    });

    const mappedUser = result.user.map((users) => users.id);

    expect(result).not.toBe([]);
    expect(result.user.length).toBe(3);
    expect(mappedUser).toContain(seededUser1.id);
    expect(mappedUser).toContain(seededUser2.id);
    expect(mappedUser).toContain(seededUser3.id);
    expect(mappedUser).not.toContain(seededUser4.id);
    expect(mappedUser).not.toContain(seededUser5.id);
    expect(mappedUser).not.toContain(seededUser6.id);
  });

  it("should return User that matches the parameter", async () => {
    const seededUser = await seedUser({ role: "ADMIN" });
    const seededUser1 = await seedUser({ role: "STAFF" });

    const result = await getUser.execute({
      id: seededUser.id,
      firstName: seededUser.firstName,
      role: "ADMIN",
      count: "1",
      page: "1"
    });

    expect(result.user.length).toBe(1);
    expect(result.user[0].id).toBe(seededUser.id);
    expect(result.user[0].id).not.toBe(seededUser1.id);
  });

  it("should return paginated users with correct metadata on first page", async () => {
    const users = await Promise.all(Array.from({ length: 15 }).map(() => seedUser({})));

    const request: GetUserRequest = {
      count: "10",
      page: "1"
    };

    const result = await getUser.execute(request);

    expect(result.user.length).toBe(10);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPages).toBe(2);
  });

  it("should return second page with correct hasPreviousPage and hasNextPage flags", async () => {
    const users = await Promise.all(Array.from({ length: 15 }).map(() => seedUser({})));

    const request: GetUserRequest = {
      count: "10",
      page: "2"
    };

    const result = await getUser.execute(request);

    expect(result.user.length).toBe(5);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(true);
    expect(result.totalPages).toBe(2);
  });

  it("should return correct user when filtering by role and searchKey", async () => {
    const seededUser1 = await seedUser({ role: "ADMIN", username: "Angelo Robee Herrera" });

    const request: GetUserRequest = {
      count: "1",
      page: "1",
      role: "ADMIN",
      searchKey: "Angelo Robee"
    };

    const result = await getUser.execute(request);

    expect(result.user.length).toBeGreaterThan(0);
    expect(result.user[0].role).toBe("ADMIN");
    expect(result.user[0].username).toContain("Angelo Robee");
  });

  it("should handle cases where no users are found", async () => {
    const request: GetUserRequest = {
      count: "1",
      page: "1",
      id: "non-existent-id"
    };

    await expect(getUser.execute(request)).rejects.toThrow(new NotFoundError("User Not Found."));
  });

  it("should properly refine string count and page to numbers", async () => {
    const seededUser = await seedUser({});

    const request: GetUserRequest = {
      id: seededUser.id,
      count: "1",
      page: "1",
      sort: "1"
    };

    const result = await getUser.execute(request);

    expect(result.user.length).toBe(1);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.hasNextPage).toBe(false);
  });

  it("should default to sort order when sort is not provided", async () => {
    const user = Promise.all([
      await seedUser({ username: "Robs" }),
      await seedUser({ username: "Herrera" })
    ]);

    const request: GetUserRequest = {
      count: "2",
      page: "1"
    };

    const result = await getUser.execute(request);

    expect(result.user.length).toBe(2);
    expect(result.user[0].username).toBe("Herrera");
    expect(result.user[1].username).toBe("Robs");
  });

  it("should sort descending when sort order is 2", async () => {
    const user = Promise.all([
      await seedUser({ username: "Robs" }),
      await seedUser({ username: "Herrera" })
    ]);

    const request: GetUserRequest = {
      count: "2",
      page: "1",
      sort: "2"
    };

    const result = await getUser.execute(request);

    expect(result.user.length).toBe(2);
    expect(result.user[0].username).toBe("Robs");
    expect(result.user[1].username).toBe("Herrera");
  });

  it("should filter user using partial user id match with searchKey", async () => {
    const user = await seedUser({});

    const result = await getUser.execute({
      searchKey: user.id.slice(0, 8),
      count: "10",
      page: "1"
    });

    expect(result.user.length).toBeGreaterThan(0);
    expect(result.user[0].id).toContain(user.id.slice(0, 8));
  });

  it("should filter user using partial lastName match with searchKey", async () => {
    const user = await seedUser({});

    const result = await getUser.execute({
      searchKey: user.lastName.slice(0, 8),
      count: "10",
      page: "1"
    });

    expect(result.user.length).toBeGreaterThan(0);
    expect(result.user[0].lastName).toContain(user.lastName.slice(0, 8));
  });

  it("should filter user using partial firstName match with searchKey", async () => {
    const user = await seedUser({});

    const result = await getUser.execute({
      searchKey: user.firstName.slice(0, 8),
      count: "10",
      page: "1"
    });

    expect(result.user.length).toBeGreaterThan(0);
    expect(result.user[0].firstName).toContain(user.firstName.slice(0, 8));
  });

  it("should filter user using partial userName match with searchKey", async () => {
    const user = await seedUser({});

    const result = await getUser.execute({
      searchKey: user.username.slice(0, 8),
      count: "10",
      page: "1"
    });

    expect(result.user.length).toBeGreaterThan(0);
    expect(result.user[0].username).toContain(user.username.slice(0, 8));
  });

  it("should filter user using partial email match with searchKey", async () => {
    const user = await seedUser({ email: "luisjoshua@gmail.com" });

    const result = await getUser.execute({
      searchKey: "luis",
      count: "10",
      page: "1"
    });

    expect(result.user.length).toBeGreaterThan(0);
    expect(result.user[0].email).toBe(user.email);
  });

  it("should filter user using strict matching for id, lastName, firstName, userName, email", async () => {
    const user = await seedUser({});

    const result = await getUser.execute({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      count: "10",
      page: "1"
    });

    expect(result.user.length).toBeGreaterThan(0);
    expect(result.user[0].id).toBe(user.id);
    expect(result.user[0].firstName).toBe(user.firstName);
    expect(result.user[0].lastName).toBe(user.lastName);
    expect(result.user[0].username).toBe(user.username);
    expect(result.user[0].email).toBe(user.email);
  });

  it("should return empty array when no property is provided", async () => {
    await expect(getUser.execute({ count: "1", page: "1" })).rejects.toThrow(
      new NotFoundError("User Not Found.")
    );
  });
});
