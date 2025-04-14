import {
  type IUserRoleService,
  UserRoleService
} from "../../modules/user/src/shared/service/userRoleService";
import { ForbiddenError } from "../core/errors";
import type { UseCaseActorInfo } from "../lib/types";

export abstract class ProtectedUseCase<Parameter, ReturnType> {
  private _userRoleService: IUserRoleService;

  protected abstract _ALLOWED_ACCESS_ROLES: string[];
  protected abstract executeImplementation(
    params: Parameter & UseCaseActorInfo
  ): Promise<ReturnType>;

  protected constructor(userRoleService: IUserRoleService = new UserRoleService()) {
    this._userRoleService = userRoleService;
  }

  public async execute(params: Parameter & UseCaseActorInfo): Promise<ReturnType> {
    await this._ensureActorHasPermission(params.actorId);

    return this.executeImplementation(params);
  }

  private async _ensureActorHasPermission(actorId: string): Promise<void> {
    const isPermitted = await this._userRoleService.hasGivenRoles(
      actorId,
      this._ALLOWED_ACCESS_ROLES
    );
    if (!isPermitted) {
      throw new ForbiddenError("You do not have permission to perform this action.");
    }
  }
}
