import { db } from "../../../../shared/infrastructure/database/prisma";
import {
  type IViolationRepository,
  ViolationRepository
} from "../../src/repositories/violationRepository";
import { createViolationDomainObject } from "../utils/violation/createViolationDomainObject";
import { seedViolation } from "../utils/violation/seedViolation";

describe("ViolationRepository.createViolation", () => {
  let violationRepository: IViolationRepository;

  beforeAll(() => {
    violationRepository = new ViolationRepository();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should successfully save the violation", async () => {
    const violationDomainObject = createViolationDomainObject({});

    const savedViolation = await violationRepository.createViolation(violationDomainObject);

    expect(savedViolation).not.toBeNull();
    expect(savedViolation?.id).toBe(violationDomainObject.id);
    expect(savedViolation?.category).toBe(violationDomainObject.category);
    expect(savedViolation?.violationName).toBe(violationDomainObject.violationName);
    expect(savedViolation?.penalty).toBe(violationDomainObject.penalty);
  });

  it("should fail to save when violation ID already exists", async () => {
    const seededViolation = await seedViolation({});
    const duplicateViolation = createViolationDomainObject({
      id: seededViolation.id
    });

    const savedViolation = await violationRepository.createViolation(duplicateViolation);

    expect(savedViolation).toBeNull();
  });
});
