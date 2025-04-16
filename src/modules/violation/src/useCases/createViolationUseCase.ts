import { BadRequest, UnexpectedError } from "../../../../shared/core/errors";
import type { IViolation } from "../domain/models/violation/classes/violation";
import { ViolationFactory } from "../domain/models/violation/factory";
import { ViolationMapper } from "../domain/models/violation/mapper";
import type { IViolationDTO } from "../dtos/violationDTO";
import type { ViolationCreateRequest } from "../dtos/violationRequestSchema";
import { ViolationRepository } from "../repositories/violationRepository";

export class CreateViolationUseCase {
  private _violationRepository: ViolationRepository;
  private _violationMapper: ViolationMapper;

  public constructor(
    violationRepository: ViolationRepository = new ViolationRepository(),
    violationMapper: ViolationMapper = new ViolationMapper()
  ) {
    this._violationRepository = violationRepository;
    this._violationMapper = violationMapper;
  }

  public async execute(params: ViolationCreateRequest): Promise<IViolationDTO> {
    this._validateInput(params);

    const violation = this._createViolationDomainObject({
      category: params.category,
      violationName: params.violationName,
      penalty: params.penalty
    });

    const savedViolation = await this._saveViolation(violation);
    return this._violationMapper.toDTO(savedViolation);
  }

  private _validateInput(params: {
    category: string;
    violationName: string;
    penalty: number;
  }): void {
    if (!params.violationName || params.violationName.trim() === "") {
      throw new BadRequest("Violation name cannot be empty");
    }

    if (!params.category || params.category.trim() === "") {
      throw new BadRequest("Category cannot be empty");
    }

    if (Number.isNaN(params.penalty)) {
      throw new BadRequest("Penalty must be a valid number");
    }

    if (params.penalty < 0) {
      throw new BadRequest("Penalty cannot be negative");
    }
  }

  private _createViolationDomainObject(params: {
    category: string;
    violationName: string;
    penalty: number;
  }): IViolation {
    const violationOrError = ViolationFactory.create(params);
    if (violationOrError.isFailure) {
      throw new BadRequest(violationOrError.getErrorMessage()!);
    }

    return violationOrError.getValue();
  }

  private async _saveViolation(violation: IViolation): Promise<IViolation> {
    const savedViolation = await this._violationRepository.createViolation(violation);
    if (!savedViolation) {
      throw new UnexpectedError("Failed to save violation");
    }

    return savedViolation;
  }
}
