import type { Role } from "@prisma/client";
import { type IUserRepository, UserRepository } from "../../repositories/userRepository";

export interface IUserRoleService {
  hasRole(userId: string, role: Role): Promise<boolean>;
  hasAdminRole(userId: string): Promise<boolean>;
  hasSecurityRole(userId: string): Promise<boolean>;
  hasGivenRoles(userId: string, roles: string[]): Promise<boolean>;
}

export class UserRoleService implements IUserRoleService {
  private _userRepository: IUserRepository;

  constructor(userRepository = new UserRepository()) {
    this._userRepository = userRepository;
  }

  public async hasRole(userId: string, role: Role): Promise<boolean> {
    const user = await this._userRepository.getUserById(userId);
    if (user === null) {
      return false;
    }

    return user.role.value === role;
  }

  public async hasGivenRoles(userId: string, roles: string[]): Promise<boolean> {
    const user = await this._userRepository.getUserById(userId);
    if (user === null) {
      return false;
    }

    const upperRoleSet = new Set(roles.map((role) => role.toUpperCase()));
    return upperRoleSet.has(user.role.value.toUpperCase());
  }

  public async hasAdminRole(userId: string): Promise<boolean> {
    return await this.hasRole(userId, "ADMIN");
  }

  public async hasSecurityRole(userId: string): Promise<boolean> {
    return await this.hasRole(userId, "SECURITY");
  }
}
