import { type IViolationMapper, ViolationMapper } from "../domain/models/violation/mapper";
import type { IViolationDTO } from "../dtos/violationDTO";
import {
  type IViolationRepository,
  ViolationRepository
} from "../repositories/violationRepository";

export class GetViolationsUseCase {
  private _violationRepository: IViolationRepository;
  private _violationMapper: IViolationMapper;

  public constructor(
    violationRepository: IViolationRepository = new ViolationRepository(),
    violationMapper: IViolationMapper = new ViolationMapper()
  ) {
    this._violationRepository = violationRepository;
    this._violationMapper = violationMapper;
  }

  public async execute(): Promise<IViolationDTO[]> {
    const violations = await this._violationRepository.getAllViolations();
    return violations.map((violation) => this._violationMapper.toDTO(violation));
  }
}
