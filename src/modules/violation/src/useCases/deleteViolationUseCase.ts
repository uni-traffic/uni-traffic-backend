import { BadRequest, NotFoundError, UnexpectedError } from "../../../../shared/core/errors";
import { ProtectedUseCase } from "../../../../shared/domain/useCase";
import type { IViolation } from "../domain/models/violation/classes/violation";
import { ViolationMapper } from "../domain/models/violation/mapper";
import type { IViolationDTO } from "../dtos/violationDTO";
import { ViolationRepository } from "../repositories/violationRepository";

export class DeleteViolationUseCase extends ProtectedUseCase<
  { violationId: string },
  IViolationDTO
> {
  protected _ALLOWED_ACCESS_ROLES: string[] = ["SUPERADMIN", "ADMIN"];
  private _violationRepository: ViolationRepository;
  private _violationMapper: ViolationMapper;

  public constructor(
    violationRepository: ViolationRepository = new ViolationRepository(),
    violationMapper: ViolationMapper = new ViolationMapper()
  ) {
    super();
    this._violationRepository = violationRepository;
    this._violationMapper = violationMapper;
  }

  protected async executeImplementation({
    violationId
  }: { violationId: string }): Promise<IViolationDTO> {
    const violation = await this._ensureViolationExist(violationId);
    const deletedViolation = this._deleteViolation(violation);
    const savedViolation = await this._saveViolation(deletedViolation);

    return this._violationMapper.toDTO(savedViolation);
  }

  private async _ensureViolationExist(violationId: string): Promise<IViolation> {
    const violation = await this._violationRepository.getViolationById(violationId);
    if (!violation) {
      throw new NotFoundError("Violation not found");
    }

    return violation;
  }

  private _deleteViolation(violation: IViolation): IViolation {
    if (violation.isDeleted) {
      throw new BadRequest("Violation is already deleted.");
    }

    violation.softDelete();

    return violation;
  }

  private async _saveViolation(violation: IViolation): Promise<IViolation> {
    const updatedViolation = await this._violationRepository.updateViolation(violation);
    if (!updatedViolation) {
      throw new UnexpectedError("Failed to delete violation");
    }

    return updatedViolation;
  }
}
