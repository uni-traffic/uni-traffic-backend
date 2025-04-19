import { db } from "../../../../../shared/infrastructure/database/prisma";
import { type IUserRepository, UserRepository } from "../../../src/repositories/userRepository";
import { seedUser } from "../../utils/user/seedUser";

describe("UserRepository.getUser", () => {
  let userRepository: IUserRepository;

  beforeAll(async () => {
    userRepository = new UserRepository();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  it("should return User when the parameter is id", async () => {
    const seededUser = await seedUser({});
    const seededUser1 = await seedUser({});

    const result = await userRepository.getUser({
      id: seededUser.id,
      count: 1,
      page: 1,
      sort: 1
    });

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(seededUser.id);
    expect(result[0].id).not.toBe(seededUser1.id);
  });

  it("should return number of users with count given", async () => {
    await seedUser({});
    await seedUser({});
    await seedUser({});
    await seedUser({});

    const result = await userRepository.getUser({
      count: 3,
      page: 1
    });

    expect(result.length).toBe(3);
  });

  it("should return User when the parameter is first name", async () => {
    const seededUser = await seedUser({ firstName: "Robs" });
    const seededUser1 = await seedUser({ firstName: "Robs" });
    const seededUser2 = await seedUser({ firstName: "Angelo" });

    const result = await userRepository.getUser({
      firstName: seededUser.firstName,
      count: 5,
      page: 1
    });

    const mappedUser = result.map((users) => users.id);

    expect(result).not.toBe([]);
    expect(result.length).toBe(2);
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

    const result = await userRepository.getUser({
      lastName: seededUser.lastName,
      count: 5,
      page: 1
    });

    const mappedUser = result.map((users) => users.id);

    expect(result).not.toBe([]);
    expect(result.length).toBe(2);
    expect(mappedUser).toContain(seededUser.id);
    expect(mappedUser).toContain(seededUser1.id);
    expect(mappedUser).not.toContain(seededUser2.id);
    expect(mappedUser).not.toContain(seededUser3.id);
    expect(mappedUser).not.toContain(seededUser4.id);
  });

  it("should return User when the parameter is email", async () => {
    const seededUser = await seedUser({});
    const seededUser1 = await seedUser({});

    const result = await userRepository.getUser({
      email: seededUser.email,
      count: 1,
      page: 1
    });

    expect(result).not.toBe([]);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(seededUser.id);
    expect(result[0]).not.toBe(seededUser1.id);
  });

  it("should return User when the parameter is role", async () => {
    const seededUser1 = await seedUser({ role: "ADMIN" });
    const seededUser2 = await seedUser({ role: "ADMIN" });
    const seededUser3 = await seedUser({ role: "ADMIN" });
    const seededUser4 = await seedUser({ role: "STAFF" });
    const seededUser5 = await seedUser({ role: "STUDENT" });
    const seededUser6 = await seedUser({ role: "SECURITY" });

    const result = await userRepository.getUser({
      role: "ADMIN",
      count: 3,
      page: 1
    });

    const mappedUser = result.map((users) => users.id);

    expect(result).not.toBe([]);
    expect(result.length).toBe(3);
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

    const result = await userRepository.getUser({
      id: seededUser.id,
      firstName: seededUser.firstName,
      role: "ADMIN",
      count: 5,
      page: 1
    });

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(seededUser.id);
    expect(result[0].id).not.toBe(seededUser1.id);
  });

  it("should return user sorted in descending order when sort is 2", async () => {
    await seedUser({ username: "Robs" });
    await seedUser({ username: "Herrera" });

    const result = await userRepository.getUser({
      count: 5,
      page: 1,
      sort: 2
    });

    const mappedUsernames = result.map((user) => user.username.value);

    expect(result.length).toBe(2);
    expect(mappedUsernames[0]).toBe("Robs");
    expect(mappedUsernames[1]).toBe("Herrera");
  });

  it("should return user sorted in ascending order when sort is 1", async () => {
    await seedUser({ username: "Robs" });
    await seedUser({ username: "Herrera" });

    const result = await userRepository.getUser({
      count: 5,
      page: 1,
      sort: 1
    });

    const mappedUsernames = result.map((user) => user.username.value);

    expect(result.length).toBe(2);
    expect(mappedUsernames[0]).toBe("Herrera");
    expect(mappedUsernames[1]).toBe("Robs");
  });

  it("should return user default sort to ascending when sort is undefined", async () => {
    await seedUser({ username: "Robs" });
    await seedUser({ username: "Herrera" });

    const result = await userRepository.getUser({
      count: 5,
      page: 1,
      sort: undefined
    });

    const mappedUsernames = result.map((user) => user.username.value);

    expect(result.length).toBe(2);
    expect(mappedUsernames[0]).toBe("Herrera");
    expect(mappedUsernames[1]).toBe("Robs");
  });

  it("should return users sorted in ascending order by default when sort is not provided", async () => {
    await seedUser({ username: "Robs" });
    await seedUser({ username: "Herrera" });

    const result = await userRepository.getUser({
      count: 5,
      page: 1
    });

    const mappedUsernames = result.map((user) => user.username.value);

    expect(result.length).toBe(2);
    expect(mappedUsernames[0]).toBe("Herrera");
    expect(mappedUsernames[1]).toBe("Robs");
  });

  it("should correctly apply pagination", async () => {
    const users = await Promise.all(Array.from({ length: 25 }).map(() => seedUser({})));

    const page1 = await userRepository.getUser({ count: 10, page: 1 });
    const page2 = await userRepository.getUser({ count: 10, page: 2 });
    const page3 = await userRepository.getUser({ count: 5, page: 3 });

    expect(page1).toHaveLength(10);
    expect(page2).toHaveLength(10);
    expect(page3).toHaveLength(5);
  });

  it("should filter user using partial user id match with searchKey", async () => {
    const user = await seedUser({});

    const result = await userRepository.getUser({
      searchKey: user.id.slice(0, 8),
      count: 10,
      page: 1
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toContain(user.id.slice(0, 8));
  });

  it("should filter user using partial lastName match with searchKey", async () => {
    const user = await seedUser({});

    const result = await userRepository.getUser({
      searchKey: user.lastName.slice(0, 8),
      count: 10,
      page: 1
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].lastName).toContain(user.lastName.slice(0, 8));
  });

  it("should filter user using partial firstName match with searchKey", async () => {
    const user = await seedUser({});

    const result = await userRepository.getUser({
      searchKey: user.firstName.slice(0, 8),
      count: 10,
      page: 1
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].firstName).toContain(user.firstName.slice(0, 8));
  });

  it("should filter user using partial userName match with searchKey", async () => {
    const user = await seedUser({});

    const result = await userRepository.getUser({
      searchKey: user.username.slice(0, 8),
      count: 10,
      page: 1
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].username.value).toContain(user.username.slice(0, 8));
  });

  it("should filter user using partial email match with searchKey", async () => {
    const user = await seedUser({});

    const result = await userRepository.getUser({
      searchKey: user.email.slice(0, 8),
      count: 10,
      page: 1
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].email.value).toContain(user.email.slice(0, 8));
  });

  it("should filter user using strict matching for id, lastName, firstName, userName, email", async () => {
    const user = await seedUser({});

    const result = await userRepository.getUser({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      count: 10,
      page: 1
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toBe(user.id);
    expect(result[0].firstName).toBe(user.firstName);
    expect(result[0].lastName).toBe(user.lastName);
    expect(result[0].username.value).toBe(user.username);
    expect(result[0].email.value).toBe(user.email);
  });

  it("should return empty array when no user is found", async () => {
    const result = await userRepository.getUser({
      id: "non-existing-id",
      count: 1,
      page: 1
    });

    expect(result).toEqual([]);
  });

  it("should return empty array when no property is provided", async () => {
    const user = await userRepository.getUser({
      count: 1,
      page: 1
    });

    expect(user).toEqual([]);
  });
});
