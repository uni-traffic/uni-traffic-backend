import { faker } from "@faker-js/faker";
import { BadRequest, NotFoundError } from "../../../../shared/core/errors";
import { db } from "../../../../shared/infrastructure/database/prisma";
import type { UpdateViolationCreateRequest } from "../../src/dtos/violationRequestSchema";
import { ViolationRepository } from "../../src/repositories/violationRepository";
import { UpdateViolationUseCase } from "../../src/useCases/updateViolationUseCase";
import { seedViolation } from "../utils/violation/seedViolation";

describe("UpdateViolationUseCase", () => {
  let updateViolationUseCase: UpdateViolationUseCase;
  let repository: ViolationRepository;

  beforeAll(() => {
    updateViolationUseCase = new UpdateViolationUseCase();
    repository = new ViolationRepository();
  });

  afterAll(async () => {
    await db.$disconnect();
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

    expect(updatedRecord?.violationName).toBe("Over-speeding");
    expect(updatedRecord?.penalty).toBe(request.penalty);
    expect(updatedRecord?.category).toBe("Speeding");
  });

  it("should update violation successfully with partial request(category)", async () => {
    const seededViolation = await seedViolation({});

    const request: UpdateViolationCreateRequest = {
      id: seededViolation.id,
      category: "Speeding"
    };

    const updateViolation = await updateViolationUseCase.execute(request);

    expect(updateViolation).not.toBeNull();
    expect(updateViolation.violationName).toBe(seededViolation.violationName);
    expect(updateViolation.penalty).toBe(seededViolation.penalty);
    expect(updateViolation.category).toBe("Speeding");

    const updatedRecord = await repository.getViolationById(seededViolation.id);

    expect(updatedRecord?.violationName).toBe(seededViolation.violationName);
    expect(updatedRecord?.penalty).toBe(seededViolation.penalty);
    expect(updatedRecord?.category).toBe("Speeding");
  });

  it("should update violation successfully with partial request(violationName)", async () => {
    const seededViolation = await seedViolation({});

    const request: UpdateViolationCreateRequest = {
      id: seededViolation.id,
      violationName: "Over-speeding"
    };

    const updateViolation = await updateViolationUseCase.execute(request);

    expect(updateViolation).not.toBeNull();
    expect(updateViolation.violationName).toBe("Over-speeding");
    expect(updateViolation.penalty).toBe(seededViolation.penalty);
    expect(updateViolation.category).toBe(seededViolation.category);

    const updatedRecord = await repository.getViolationById(seededViolation.id);

    expect(updatedRecord?.violationName).toBe("Over-speeding");
    expect(updatedRecord?.penalty).toBe(seededViolation.penalty);
    expect(updatedRecord?.category).toBe(seededViolation.category);
  });

  it("should update violation successfully with partial request(penalty)", async () => {
    const seededViolation = await seedViolation({});

    const request: UpdateViolationCreateRequest = {
      id: seededViolation.id,
      penalty: faker.number.int({ max: 1000, min: 0 })
    };

    const updateViolation = await updateViolationUseCase.execute(request);

    expect(updateViolation).not.toBeNull();
    expect(updateViolation.violationName).toBe(seededViolation.violationName);
    expect(updateViolation.penalty).toBe(request.penalty);
    expect(updateViolation.category).toBe(seededViolation.category);

    const updatedRecord = await repository.getViolationById(seededViolation.id);

    expect(updatedRecord?.violationName).toBe(seededViolation.violationName);
    expect(updatedRecord?.penalty).toBe(request.penalty);
    expect(updatedRecord?.category).toBe(seededViolation.category);
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
      new BadRequest("Category cannot be an empty string.")
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
      new BadRequest("Violation name cannot be an empty string.")
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
      new BadRequest("Penalty cannot be negative.")
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
      new BadRequest("Penalty must be a whole number.")
    );
  });

  it("should not corrupt other data in violation object", async () => {
    const seededViolation = await seedViolation({});

    const testPayload: UpdateViolationCreateRequest = {
      id: "non-existing-id",
      category: "D"
    };

    await expect(updateViolationUseCase.execute(testPayload)).rejects.toThrow(
      new NotFoundError("Violation not found!")
    );

    const updatedRecord = await repository.getViolationById(seededViolation.id);

    expect(updatedRecord?.violationName).toBe(seededViolation.violationName);
    expect(updatedRecord?.penalty).toBe(seededViolation.penalty);
    expect(updatedRecord?.category).toBe(seededViolation.category);
  });

  it("should fail to update violation when violationId is not found", async () => {
    const request: UpdateViolationCreateRequest = {
      id: faker.string.uuid(),
      category: "Speeding",
      violationName: "Over-speeding",
      penalty: faker.number.int({ max: 1000, min: 0 })
    };

    await expect(updateViolationUseCase.execute(request)).rejects.toThrow(
      new BadRequest("Violation not found!")
    );
  });
});
