import { faker } from "@faker-js/faker";
import { ViolationRepository } from "../../src/repositories/violationRepository";
import { seedViolation } from "../utils/violation/seedViolation";
import type { UpdateViolationCreateRequest } from "../../src/dtos/violationRequestSchema";

describe("ViolationRepository.updateViolation", () => {
  let repository: ViolationRepository;

  beforeAll(() => {
    repository = new ViolationRepository();
  });

  it("it should update violation successfully with given parameters", async () => {
    const seededViolation = await seedViolation({});

    const request: UpdateViolationCreateRequest = {
      id: seededViolation.id,
      category: "Speeding",
      violationName: "Over-speeding",
      penalty: faker.number.int({ max: 1000, min: 0 })
    };

    const updateViolation = await repository.updateViolation(request);

    expect(updateViolation).not.toBeNull();

    const updatedRecord = await repository.getViolationById(seededViolation.id);

    expect(updatedRecord).not.toBeNull();
    expect(updatedRecord?.violationName).toBe("Over-speeding");
    expect(updatedRecord?.penalty).toBe(request.penalty);
    expect(updatedRecord?.category).toBe("Speeding");
  });

  it("should fail to update violation when category is empty string", async () => {
    const seededViolation = await seedViolation({});

    const request: UpdateViolationCreateRequest = {
      id: seededViolation.id,
      category: "",
      violationName: "Over-speeding",
      penalty: faker.number.int({ max: 1000, min: 0 })
    };

    const updateViolation = await repository.updateViolation(request);

    expect(updateViolation).toBeNull();

    const updatedRecord = await repository.getViolationById(seededViolation.id);

    expect(updatedRecord?.penalty).toBe(seededViolation.penalty);
    expect(updatedRecord?.violationName).toBe(seededViolation.violationName);
    expect(updatedRecord?.category).toBe(seededViolation.category);
  });

  it("should fail to update violation when violationName is empty string", async () => {
    const seededViolation = await seedViolation({});

    const request: UpdateViolationCreateRequest = {
      id: seededViolation.id,
      category: "Speeding",
      violationName: "",
      penalty: faker.number.int({ max: 1000, min: 0 })
    };

    const updateViolation = await repository.updateViolation(request);

    expect(updateViolation).toBeNull();

    const updatedRecord = await repository.getViolationById(seededViolation.id);

    expect(updatedRecord?.penalty).toBe(seededViolation.penalty);
    expect(updatedRecord?.violationName).toBe(seededViolation.violationName);
    expect(updatedRecord?.category).toBe(seededViolation.category);
  });

  it("should fail to update violation when penalty is negative", async () => {
    const seededViolation = await seedViolation({});

    const request: UpdateViolationCreateRequest = {
      id: seededViolation.id,
      category: "Speeding",
      violationName: "Over-speeding",
      penalty: faker.number.int({ max: 0, min: -1000 })
    };

    const updateViolation = await repository.updateViolation(request);

    expect(updateViolation).toBeNull();

    const updatedRecord = await repository.getViolationById(seededViolation.id);

    expect(updatedRecord?.penalty).toBe(seededViolation.penalty);
    expect(updatedRecord?.violationName).toBe(seededViolation.violationName);
    expect(updatedRecord?.category).toBe(seededViolation.category);
  });
});
