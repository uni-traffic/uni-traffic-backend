import { faker } from "@faker-js/faker";
import type { UpdateViolationCreateRequest } from "../../src/dtos/violationRequestSchema";
import { ViolationRepository } from "../../src/repositories/violationRepository";
import { UpdateViolationUseCase } from "../../src/useCases/updateViolationUseCase";
import { seedViolation } from "../utils/violation/seedViolation";
import { BadRequest } from "../../../../shared/core/errors";

describe("UpdateViolationUseCase", () => {
  let updateViolationUseCase: UpdateViolationUseCase;
  let repository: ViolationRepository;

  beforeAll(() => {
    updateViolationUseCase = new UpdateViolationUseCase();
    repository = new ViolationRepository();
  });

  it("should update violation successfully", async () => {
    const seededViolation = await seedViolation({});

    const request: UpdateViolationCreateRequest = {
      id: seededViolation.id,
      category: "Speeding",
      violationName: "Over-speeding",
      penalty: faker.number.int({ max: 1000, min: 0 })
    };

    const updateViolation = await updateViolationUseCase.execute(request);

    expect(updateViolation).not.toBeNull();
    expect(updateViolation.violationName).toBe("Over-speeding");
    expect(updateViolation.penalty).toBe(request.penalty);
    expect(updateViolation.category).toBe("Speeding");

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

    await expect(updateViolationUseCase.execute(request)).rejects.toThrow(
      new BadRequest("Category cannot be empty")
    );
  });

  it("should fail to update violation when violationName is empty string", async () => {
    const seededViolation = await seedViolation({});

    const request: UpdateViolationCreateRequest = {
      id: seededViolation.id,
      category: "Speeding",
      violationName: "",
      penalty: faker.number.int({ max: 1000, min: 0 })
    };

    await expect(updateViolationUseCase.execute(request)).rejects.toThrow(
      new BadRequest("Violation name cannot be empty")
    );
  });

  it("should fail to update violation when penalty is negative", async () => {
    const seededViolation = await seedViolation({});

    const request: UpdateViolationCreateRequest = {
      id: seededViolation.id,
      category: "Speeding",
      violationName: "Over-speeding",
      penalty: -100
    };

    await expect(updateViolationUseCase.execute(request)).rejects.toThrow(
      new BadRequest("Penalty cannot be negative")
    );
  });

  it("should fail to update violation when penalty is not a whole number", async () => {
    const seededViolation = await seedViolation({});

    const request: UpdateViolationCreateRequest = {
      id: seededViolation.id,
      category: "Speeding",
      violationName: "Over-speeding",
      penalty: faker.number.float({ max: 1000, min: 0 })
    };

    await expect(updateViolationUseCase.execute(request)).rejects.toThrow(
      new BadRequest("Penalty must be an integer")
    );
  });

  it("should fail to update violation when penalty is undefined", async () => {
    const seededViolation = await seedViolation({});

    const request: UpdateViolationCreateRequest = {
      id: seededViolation.id,
      category: "Speeding",
      violationName: "Over-speeding",
      penalty: undefined
    };

    await expect(updateViolationUseCase.execute(request)).rejects.toThrow(
      new BadRequest("Penalty is required")
    );
  });

  it("should fail to update violation when violationId is not found", async () => {
    const request: UpdateViolationCreateRequest = {
      id: faker.string.uuid(),
      category: "Speeding",
      violationName: "Over-speeding",
      penalty: faker.number.int({ max: 1000, min: 0 })
    };

    await expect(updateViolationUseCase.execute(request)).rejects.toThrow(
      new BadRequest("Violation not found")
    );
  });
});
