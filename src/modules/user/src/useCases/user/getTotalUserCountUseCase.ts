import { BadRequest } from "../../../../../shared/core/errors";
import type { IUserRepository } from "../../repositories/userRepository";

export class GetTotalUserCountUseCase {
  private _userRepository: IUserRepository;

  public constructor(userRepository: IUserRepository) {
    this._userRepository = userRepository;
  }

  public async execute(type?: string): Promise<{ count: number }> {
    this._ensureTypeIsValid(type);

    switch (type) {
      case "MANAGEMENT":
        return {
          count: await this._userRepository.getTotalUserCount([
            "CASHIER",
            "SECURITY",
            "ADMIN",
            "SUPERADMIN"
          ])
        };
      case "APP_USERS":
        return {
          count: await this._userRepository.getTotalUserCount(["GUEST", "STUDENT", "STAFF"])
        };
      default:
        return { count: await this._userRepository.getTotalUserCount() };
    }
  }

  private _ensureTypeIsValid(type?: string): void {
    const validTypes = ["ALL", "MANAGEMENT", "APP_USERS"];
    if (type && !validTypes.includes(type)) {
      throw new BadRequest(
        `Invalid type: ${type}. Valid types are 'ALL', 'MANAGEMENT', 'APP_USERS', or undefined.`
      );
    }
  }
}
