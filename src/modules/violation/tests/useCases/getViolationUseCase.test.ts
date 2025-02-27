import type { IViolationDTO } from "../../src/dtos/violationDTO";
import { ViolationRepository } from "../../src/repositories/violationRepository";
import { GetViolationsUseCase } from "../../src/useCases/getViolationUseCase";

const assertViolation = (received: IViolationDTO, expected: IViolationDTO) => {
  expect(received.id).toBe(expected.id);
  expect(received.category).toBe(expected.category);
  expect(received.violationName).toBe(expected.violationName);
  expect(received.penalty).toBe(expected.penalty);
};

describe("GetViolationsUseCase", () => {
  let getViolationsUseCase: GetViolationsUseCase;
  let violationRepository: ViolationRepository;

  beforeAll(() => {
    violationRepository = new ViolationRepository();
    getViolationsUseCase = new GetViolationsUseCase();
  });

  it("should return a list of ViolationDTOs", async () => {
    const violations = await violationRepository.getAllViolations();
    const violationDTOs = await getViolationsUseCase.execute();

    expect(violationDTOs).toBeDefined();
    expect(violationDTOs.length).toBe(violations.length);
    violationDTOs.forEach((dto, index) => assertViolation(dto, violations[index]));
  });
});
