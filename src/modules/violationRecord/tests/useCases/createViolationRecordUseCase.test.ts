import { faker } from "@faker-js/faker";
import { NotFoundError } from "../../../../shared/core/errors";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import { seedVehicle } from "../../../vehicle/tests/utils/vehicle/seedVehicle";
import { seedViolation } from "../../../violation/tests/utils/violation/seedViolation";
import type { ICreateViolationRecordInputUseCase } from "../../src/dtos/violationRecordDTO";
import { CreateViolationRecordUseCase } from "../../src/useCases/createViolationRecordUseCase";

describe("CreateViolationRecordUseCase", () => {
  let createViolationRecordUseCase: CreateViolationRecordUseCase;

  beforeAll(() => {
    createViolationRecordUseCase = new CreateViolationRecordUseCase();
  });

  beforeEach(async () => {
    await db.violationRecord.deleteMany();
    await db.violation.deleteMany();
    await seedViolation({ id: "1" });
  });

  it("should successfully create a ViolationRecord when only vehicleId is provided", async () => {
    const seededSecurityUser = await seedUser({ role: "SECURITY" });
    const seededUser = await seedUser({});
    const seededVehicle = await seedVehicle({ ownerId: seededUser.id });

    const mockRequestData: ICreateViolationRecordInputUseCase = {
      remarks: faker.lorem.sentence({ min: 3, max: 15 }),
      vehicleId: seededVehicle.id,
      reportedById: seededSecurityUser.id,
      violationId: "1"
    };

    const violationRecordDTO = await createViolationRecordUseCase.execute(mockRequestData);

    expect(violationRecordDTO).toBeDefined();
  });

  it("should successfully create a ViolationRecord when only licensePlate is provided", async () => {
    const seededSecurityUser = await seedUser({ role: "SECURITY" });
    const seededUser = await seedUser({});
    const seededVehicle = await seedVehicle({ ownerId: seededUser.id });

    const mockRequestData: ICreateViolationRecordInputUseCase = {
      remarks: faker.lorem.sentence({ min: 3, max: 15 }),
      licensePlate: seededVehicle.licensePlate,
      reportedById: seededSecurityUser.id,
      violationId: "1"
    };

    const violationRecordDTO = await createViolationRecordUseCase.execute(mockRequestData);

    expect(violationRecordDTO).toBeDefined();
  });

  it("should successfully create a ViolationRecord when only stickerNumber is provided", async () => {
    const seededSecurityUser = await seedUser({ role: "SECURITY" });
    const seededUser = await seedUser({});
    const seededVehicle = await seedVehicle({ ownerId: seededUser.id });

    const mockRequestData: ICreateViolationRecordInputUseCase = {
      remarks: faker.lorem.sentence({ min: 3, max: 15 }),
      stickerNumber: seededVehicle.stickerNumber,
      reportedById: seededSecurityUser.id,
      violationId: "1"
    };

    const violationRecordDTO = await createViolationRecordUseCase.execute(mockRequestData);

    expect(violationRecordDTO).toBeDefined();
  });

  it("should fail when the provided vehicleId doesn't exist on the system", async () => {
    const seededSecurityUser = await seedUser({ role: "SECURITY" });

    const mockRequestData: ICreateViolationRecordInputUseCase = {
      remarks: faker.lorem.sentence({ min: 3, max: 15 }),
      stickerNumber: faker.string.uuid(),
      reportedById: seededSecurityUser.id,
      violationId: "1"
    };

    await expect(createViolationRecordUseCase.execute(mockRequestData)).rejects.toThrow(
      new NotFoundError(
        "The vehicle record that you've provided didn't match any records in our system."
      )
    );
  });

  it("should fail when the provided licensePlate doesn't exist on the system", async () => {
    const seededSecurityUser = await seedUser({ role: "SECURITY" });

    const mockRequestData: ICreateViolationRecordInputUseCase = {
      remarks: faker.lorem.sentence({ min: 3, max: 15 }),
      licensePlate: faker.vehicle.vrm(),
      reportedById: seededSecurityUser.id,
      violationId: "1"
    };

    await expect(createViolationRecordUseCase.execute(mockRequestData)).rejects.toThrow(
      new NotFoundError(
        "The vehicle record that you've provided didn't match any records in our system."
      )
    );
  });

  it("should fail when the provided stickerNumber doesn't exist on the system", async () => {
    const seededSecurityUser = await seedUser({ role: "SECURITY" });

    const mockRequestData: ICreateViolationRecordInputUseCase = {
      remarks: faker.lorem.sentence({ min: 3, max: 15 }),
      stickerNumber: faker.vehicle.vin(),
      reportedById: seededSecurityUser.id,
      violationId: "1"
    };

    await expect(createViolationRecordUseCase.execute(mockRequestData)).rejects.toThrow(
      new NotFoundError(
        "The vehicle record that you've provided didn't match any records in our system."
      )
    );
  });
});
