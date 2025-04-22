import { BadRequest, NotFoundError } from "../../../../shared/core/errors";
import type { IViolation } from "../domain/models/violation/classes/violation";
import { ViolationMapper } from "../domain/models/violation/mapper";
import type { UpdateViolationCreateRequest } from "../dtos/violationRequestSchema";
import { ViolationRepository } from "../repositories/violationRepository";

export class UpdateViolationUseCase {
  private _violationRepository: ViolationRepository;
  private _violationMapper: ViolationMapper;

  public constructor(
    violationRepository: ViolationRepository = new ViolationRepository(),
    violationMapper: ViolationMapper = new ViolationMapper()
  ) {
    this._violationRepository = violationRepository;
    this._violationMapper = violationMapper;
  }

  public async execute(violation: UpdateViolationCreateRequest) {
    this._validateInput(violation);
    const violationFromDatabase = await this._getViolationFromDatabase(violation.id);
    const updatedViolation = this._updateViolation(violationFromDatabase, violation);
    const savedViolation = await this._saveViolationToDatabase(updatedViolation);

    return this._violationMapper.toDTO(savedViolation);
  }

  private _validateInput(violation: UpdateViolationCreateRequest): void {
    if (violation.category! === "") {
      throw new BadRequest("Category cannot be an empty string.");
    }

    if (violation.violationName! === "") {
      throw new BadRequest("Violation name cannot be an empty string.");
    }

    if (violation.penalty !== undefined) {
      if (violation.penalty < 0) {
        throw new BadRequest("Penalty cannot be negative.");
      }
      if (!Number.isInteger(violation.penalty)) {
        throw new BadRequest("Penalty must be a whole number.");
      }
    }
  }

  private async _getViolationFromDatabase(violationId: string): Promise<IViolation> {
    const violation = await this._violationRepository.getViolationById(violationId);
    if (!violation) {
      throw new NotFoundError("Violation not found!");
    }
    return violation;
  }

  private _updateViolation(
    violation: IViolation,
    violationData: UpdateViolationCreateRequest
  ): IViolation {
    if (violationData.category) {
      violation.updateCategory(violationData.category);
    }

    if (violationData.violationName) {
      violation.updateViolationName(violationData.violationName);
    }

    if (violationData.penalty !== undefined) {
      violation.updatePenalty(violationData.penalty);
    }

    return violation;
  }

  private async _saveViolationToDatabase(violation: IViolation): Promise<IViolation> {
    const savedViolation = await this._violationRepository.updateViolation(violation);
    if (!savedViolation) {
      throw new BadRequest("Failed to update violation.");
    }

    return savedViolation;
  }
}
