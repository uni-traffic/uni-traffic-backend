import { faker } from "@faker-js/faker";
import { BadRequest, NotFoundError } from "../../../../../shared/core/errors";
import { UserRole } from "../../../src/domain/models/user/classes/userRole";
import { type IUserRepository, UserRepository } from "../../../src/repositories/userRepository";
import { UpdateUserRoleUseCase } from "../../../src/useCases/user/updateUserRoleUseCase";
import { seedUser } from "../../utils/user/seedUser";

describe("UpdateUserRoleUseCase", () => {
  let updateUserRoleUseCase: UpdateUserRoleUseCase;
  let userRepository: IUserRepository;

  beforeAll(() => {
    updateUserRoleUseCase = new UpdateUserRoleUseCase();
    userRepository = new UserRepository();
  });

  it("should successfully update the user role", async () => {
    const seededUser = await seedUser({ role: "STUDENT" });

    const updatedUser = await updateUserRoleUseCase.execute({
      userId: seededUser.id,
      role: "ADMIN"
    });

    expect(updatedUser.role).toBe("ADMIN");

    const userFromDatabase = await userRepository.getUserById(seededUser.id);

    expect(userFromDatabase).not.toBeNull();
    expect(userFromDatabase!.role.value).toBe("ADMIN");
  });

  it("should throw NotFoundError when user id provided does not exist on the system", async () => {
    await expect(
      updateUserRoleUseCase.execute({
        userId: faker.string.uuid(),
        role: "ADMIN"
      })
    ).rejects.toThrow(new NotFoundError("User not found!"));
  });

  it("should throw BadRequestError when role provided is invalid", async () => {
    const seededUser = await seedUser({ role: "STUDENT" });

    await expect(
      updateUserRoleUseCase.execute({
        userId: seededUser.id,
        role: "HELLO"
      })
    ).rejects.toThrow(
      new BadRequest(`Invalid user role. Valid roles are ${UserRole.validRoles.join(", ")}`)
    );
  });
});
