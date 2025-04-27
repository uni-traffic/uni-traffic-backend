import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IViolationDTO } from "../../src/dtos/violationDTO";
import { ViolationRepository } from "../../src/repositories/violationRepository";
import { GetNonDeletedViolationUseCase } from "../../src/useCases/getNonDeletedViolationUseCase";

const assertViolation = (received: IViolationDTO, expected: IViolationDTO) => {
  expect(received.id).toBe(expected.id);
  expect(received.category).toBe(expected.category);
  expect(received.violationName).toBe(expected.violationName);
  expect(received.penalty).toBe(expected.penalty);
};

describe("GetNonDeletedViolationUseCase", () => {
  let getViolationsUseCase: GetNonDeletedViolationUseCase;
  let violationRepository: ViolationRepository;

  beforeAll(() => {
    violationRepository = new ViolationRepository();
    getViolationsUseCase = new GetNonDeletedViolationUseCase();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return a list of ViolationDTOs", async () => {
    const violations = await violationRepository.getAllViolations();
    const violationDTOs = await getViolationsUseCase.execute();

    expect(violationDTOs).toBeDefined();
    expect(violationDTOs.length).toBe(violations.length);
    violationDTOs.forEach((dto, index) => assertViolation(dto, violations[index]));
  });
});
