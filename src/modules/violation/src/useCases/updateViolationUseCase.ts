import { BadRequest, NotFoundError } from "../../../../shared/core/errors";
import { Violation, type IViolation } from "../domain/models/violation/classes/violation";
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
    const newViolation = this._getNewViolation(violation);
    const violationFromDatabase = await this._getViolationFromDatabase(violation.id);
    const updatedViolation = this._updateViolation(violationFromDatabase, newViolation);
    const savedViolation = await this._saveViolationToDatabase(updatedViolation);

    return this._violationMapper.toDTO(savedViolation);
  }

  private async _getViolationFromDatabase(violationId: string): Promise<IViolation> {
    const violation = await this._violationRepository.getViolationById(violationId);
    if (!violation) {
      throw new NotFoundError("Violation not found!");
    }

    return violation;
  }

  private _getNewViolation(violation: UpdateViolationCreateRequest): IViolation {
    if (violation.category!.trim() === "") {
      throw new BadRequest("Category cannot be an empty string.");
    }

    if (violation.violationName!.trim() === "") {
      throw new BadRequest("Violation name cannot be an empty string.");
    }

    if (violation.penalty! === undefined) {
      throw new BadRequest("Penalty is required.");
    }

    if (violation.penalty! < 0) {
      throw new BadRequest("Penalty cannot be negative.");
    }

    if (!Number.isInteger(violation.penalty!)) {
      throw new BadRequest("Penalty must be an whole number.");
    }

    return Violation.create({
      id: violation.id,
      category: violation.category!,
      violationName: violation.violationName!,
      penalty: violation.penalty!
    });
  }

  private _updateViolation(violation: IViolation, newViolation: IViolation): IViolation {
    violation.updateViolation(newViolation);

    if (violation.category !== newViolation.category) {
      throw new BadRequest("Category has been updated incorrectly.");
    }

    if (violation.violationName !== newViolation.violationName) {
      throw new BadRequest("Violation name has been updated incorrectly.");
    }

    if (violation.penalty !== newViolation.penalty) {
      if (newViolation.penalty < 0) {
        throw new BadRequest("Penalty cannot be negative.");
      }
    }

    return violation;
  }

  private async _saveViolationToDatabase(violation: IViolation): Promise<IViolation> {
    const savedViolation = await this._violationRepository.updateViolation(violation);
    if (!savedViolation) {
      throw new BadRequest("Failed to update Violation");
    }

    return savedViolation;
  }
}
