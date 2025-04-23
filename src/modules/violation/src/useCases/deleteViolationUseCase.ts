import { BadRequest, NotFoundError } from "../../../../shared/core/errors";
import { ViolationRepository } from "../repositories/violationRepository";
import { ViolationMapper } from "../domain/models/violation/mapper";
import type { IViolationDTO } from "../dtos/violationDTO";
import type { IViolation } from "../domain/models/violation/classes/violation";

export class DeleteViolationUseCase {
  private _violationRepository: ViolationRepository;
  private _violationMapper: ViolationMapper;

  public constructor(
    violationRepository: ViolationRepository = new ViolationRepository(),
    violationMapper: ViolationMapper = new ViolationMapper()
  ) {
    this._violationRepository = violationRepository;
    this._violationMapper = violationMapper;
  }

  public async execute(violationId: string): Promise<IViolationDTO> {
    const violation = await this._validateInput(violationId);
    return this._violationMapper.toDTO(violation);
  }

  private async _validateInput(violationId: string): Promise<IViolation> {
    if (!violationId || violationId.trim() === "") {
      throw new BadRequest("Violation ID is required");
    }

    const violation = await this._violationRepository.getViolationById(violationId);
    if (!violation) {
      throw new NotFoundError("Violation not found");
    }

    violation.softDelete();

    const updatedViolation = await this._violationRepository.updateViolation(violation);
    if (!updatedViolation) {
      throw new BadRequest("Failed to delete violation");
    }

    return updatedViolation;
  }
}
