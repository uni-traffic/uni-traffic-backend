import { ProtectedUseCase } from "../../../../shared/domain/useCase";
import type { UseCaseActorInfo } from "../../../../shared/lib/types";
import type { UnpaidAndPaidViolationTotal } from "../dtos/violationRecordDTO";
import {
  type IViolationRecordRepository,
  ViolationRecordRepository
} from "../repositories/violationRecordRepository";

export class GetUnpaidAndPaidViolationTotalUseCase extends ProtectedUseCase<
  UseCaseActorInfo,
  UnpaidAndPaidViolationTotal
> {
  protected _ALLOWED_ACCESS_ROLES: string[] = ["ADMIN", "SUPERADMIN", "CASHIER"];
  private _violationRecordRepository: IViolationRecordRepository;

  public constructor(
    violationRecordRepository: IViolationRecordRepository = new ViolationRecordRepository()
  ) {
    super();
    this._violationRecordRepository = violationRecordRepository;
  }

  public async executeImplementation(): Promise<UnpaidAndPaidViolationTotal> {
    return await this._getUnpaidAndPaidTotal();
  }

  private async _getUnpaidAndPaidTotal(): Promise<UnpaidAndPaidViolationTotal> {
    return this._violationRecordRepository.getUnpaidAndPaidViolationTotal();
  }
}
