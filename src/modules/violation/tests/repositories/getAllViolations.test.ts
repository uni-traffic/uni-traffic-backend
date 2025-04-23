import { seedViolations } from "../../../../../scripts/seedViolation";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { type IViolationMapper, ViolationMapper } from "../../src/domain/models/violation/mapper";
import { ViolationRepository } from "../../src/repositories/violationRepository";

describe("ViolationRepository.getAllViolations", () => {
  let violationRepository: ViolationRepository;
  let violationMapper: IViolationMapper;

  beforeAll(async () => {
    violationRepository = new ViolationRepository();
    violationMapper = new ViolationMapper();
    await seedViolations();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return all violations from the database", async () => {
    const seededViolations = await db.violation.findMany();

    const violations = await violationRepository.getAllViolations();
    const mappedViolations = violations.map((v) => violationMapper.toDTO(v));

    expect(mappedViolations).toEqual(seededViolations);
  });

  it("should return an empty array if no violations exist", async () => {
    await db.violation.deleteMany();

    const violations = await violationRepository.getAllViolations();

    expect(violations).toEqual([]);
  });
});
