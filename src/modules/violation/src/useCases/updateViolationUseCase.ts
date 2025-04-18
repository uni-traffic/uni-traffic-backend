import { BadRequest, NotFoundError } from "../../../../shared/core/errors";
import type { IViolation } from "../domain/models/violation/classes/violation";
import { ViolationMapper } from "../domain/models/violation/mapper";
import type { IViolationDTO } from "../dtos/violationDTO";
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

  public async execute(params: UpdateViolationCreateRequest): Promise<IViolationDTO> {
    await this._getViolationFromDatabase(params.id);
    this._validateInput(params);
    const updatedViolation = await this._updateViolationInDatabase(params);

    return updatedViolation;
  }

  private async _updateViolationInDatabase(
    params: UpdateViolationCreateRequest
  ): Promise<IViolationDTO> {
    const violation = await this._violationRepository.updateViolation(params);
    if (!violation) {
      throw new BadRequest("Failed to update violation");
    }

    return this._violationMapper.toDTO(violation);
  }

  private async _getViolationFromDatabase(violationId: string): Promise<IViolation> {
    const violation = await this._violationRepository.getViolationById(violationId);
    if (!violation) {
      throw new NotFoundError("Violation not found");
    }

    return violation;
  }

  private _validateInput(params: UpdateViolationCreateRequest): void {
    if (!params.violationName || params.violationName.trim() === "") {
      throw new BadRequest("Violation name cannot be empty");
    }

    if (!params.category || params.category.trim() === "") {
      throw new BadRequest("Category cannot be empty");
    }

    if (params.penalty === undefined) {
      throw new BadRequest("Penalty is required");
    }

    if (params.penalty < 0) {
      throw new BadRequest("Penalty cannot be negative");
    }

    if (!Number.isInteger(params.penalty)) {
      throw new BadRequest("Penalty must be an integer");
    }
  }
}
