import type { IUserDTO } from "../../dtos/userDTO";
import { UpdateUserRoleUseCase } from "../../useCases/user/updateUserRoleUseCase";

export interface IUserService {
  updateUserRole({ userId, role }: { userId: string; role: string }): Promise<IUserDTO>;
}

export class UserService implements IUserService {
  private _updateUserRoleUseCase: UpdateUserRoleUseCase;

  public constructor(updateUserRoleUseCase = new UpdateUserRoleUseCase()) {
    this._updateUserRoleUseCase = updateUserRoleUseCase;
  }

  public async updateUserRole({
    userId,
    role
  }: { userId: string; role: string }): Promise<IUserDTO> {
    return this._updateUserRoleUseCase.execute({ userId, role });
  }
}
