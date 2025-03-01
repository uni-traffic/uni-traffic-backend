import { faker } from "@faker-js/faker";
import { NotFoundError } from "../../../../../shared/core/errors";
import { GetUserByIdUseCase } from "../../../src/useCases/user/getUserByIdUseCase";
import { seedUser } from "../../utils/user/seedUser";

describe("GetUserByIdUseCase", () => {
  let getUserByIdUseCase: GetUserByIdUseCase;

  beforeAll(() => {
    getUserByIdUseCase = new GetUserByIdUseCase();
  });

  it("should get the user by the given id", async () => {
    const seededUser = await seedUser({});

    const user = await getUserByIdUseCase.execute(seededUser.id);

    expect(user).not.toBeNull();
    expect(user.id).toBe(seededUser.id);
    expect(user.username).toBe(seededUser.username);
    expect(user.email).toBe(seededUser.email);
    expect(user.lastName).toBe(seededUser.lastName);
    expect(user.firstName).toBe(seededUser.firstName);
    expect(user.role).toBe(seededUser.role);
  });

  it("should throw not found error when user doesn't exist on the system", async () => {
    await expect(getUserByIdUseCase.execute(faker.string.uuid())).rejects.toThrow(
      new NotFoundError("User Not Found")
    );
  });
});
