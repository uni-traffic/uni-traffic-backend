import { db } from "../../../../../shared/infrastructure/database/prisma";
import { UserRepository, type IUserRepository } from "../../../src/repositories/userRepository";
import { seedUser } from "../../utils/user/seedUser";

describe("UserRepository.getUserByProperty", () => {
  let _userRepository: IUserRepository;

  beforeAll(async () => {
    _userRepository = new UserRepository();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  it("should return User when the parameter is id", async () => {
    const seededUser = await seedUser({});
    const seededUser1 = await seedUser({});

    const result = await _userRepository.getUserByProperty({
      id: seededUser.id
    });

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(seededUser.id);
    expect(result[0].id).not.toBe(seededUser1.id);
  });

  it("should return User when the parameter is first name", async () => {
    const seededUser = await seedUser({ firstName: "Robs" });
    const seededUser1 = await seedUser({ firstName: "Robs" });
    const seededUser2 = await seedUser({ firstName: "Angelo" });

    const result = await _userRepository.getUserByProperty({
      firstName: seededUser.firstName
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

    const result = await _userRepository.getUserByProperty({
      lastName: seededUser.lastName
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

    const result = await _userRepository.getUserByProperty({
      email: seededUser.email
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

    const result = await _userRepository.getUserByProperty({
      role: "ADMIN"
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

    const result = await _userRepository.getUserByProperty({
      id: seededUser.id,
      firstName: seededUser.firstName,
      role: "ADMIN"
    });

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(seededUser.id);
    expect(result[0].id).not.toBe(seededUser1.id);
  });

  it("should return empty array when no property is provided", async () => {
    const user = await _userRepository.getUserByProperty({});

    expect(user).toEqual([]);
  });
});
