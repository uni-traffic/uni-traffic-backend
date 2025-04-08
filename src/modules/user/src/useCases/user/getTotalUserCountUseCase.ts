import { IUserRepository } from "../../repositories/userRepository";

export class GetTotalUserCountUseCase {
  private _userRepository: IUserRepository;

  public constructor(userRepository: IUserRepository) {
    this._userRepository = userRepository;
  }

  public async execute(type: string): Promise<{ count: number }> {
    switch (type) {
      case 'MANAGEMENT':
        return { count: await this._userRepository.getTotalUserCount(['CASHIER', 'SECURITY', 'ADMIN', 'SUPERADMIN']) };
      case 'APP_USERS':
        return { count: await this._userRepository.getTotalUserCount(['GUEST', 'STUDENT', 'STAFF']) };
      case 'ALL':
        return { count: await this._userRepository.getTotalUserCount() };
      default:
        throw new Error('Invalid user type');
    }
  }
}
