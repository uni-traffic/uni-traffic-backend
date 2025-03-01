import { db } from "../../../../shared/infrastructure/database/prisma";
import { CreateViolationRecordInput, CreateViolationRecordUseCase } from "../../src/useCases/createViolationRecordUseCase";
import { seedAuthenticatedUser } from "../../../user/tests/utils/user/seedAuthenticatedUser";
import { seedVehicle } from "../../../vehicle/tests/utils/vehicle/seedVehicle";
import { seedViolation } from "../../../violation/tests/utils/violation/seedViolation";

describe("CreateViolationRecordUseCase", () => {
  let createViolationRecordUseCase: CreateViolationRecordUseCase;
  let newViolationData: CreateViolationRecordInput;
  let emptyViolationData: CreateViolationRecordInput;

  beforeAll(() => {
    createViolationRecordUseCase = new CreateViolationRecordUseCase();
  });

  beforeEach(async () => {
    await db.violationRecord.deleteMany(); 
    await db.user.deleteMany();

    const user = await seedAuthenticatedUser({ role: "STUDENT", expiration: "1h" });
    const reporter = await seedAuthenticatedUser({ role: "SECURITY", expiration: "1h" });
    const violation = await seedViolation();
    const vehicle = await seedVehicle({ownerId: user.id});

    newViolationData = {
        userId: user.id,
        reportedById: reporter.id,
        violationId: violation.id,
        vehicleId: vehicle.id,
        status: "UNPAID",
    };
  });

  it("should create a violation record successfully", async () => {
    const violationRecord = await createViolationRecordUseCase.execute(newViolationData);

    expect(violationRecord).toBeTruthy();
    expect(violationRecord.userId).toBe(newViolationData.userId);
    expect(violationRecord.vehicleId).toBe(newViolationData.vehicleId);
    expect(violationRecord.violationId).toBe(newViolationData.violationId);
    expect(violationRecord.reportedById).toBe(newViolationData.reportedById);
    expect(violationRecord.status).toBe("UNPAID");

    const recordInDb = await db.violationRecord.findUnique({
      where: { id: violationRecord.id },
    });

    expect(recordInDb).toBeTruthy();
    expect(recordInDb?.status).toBe("UNPAID");
  });

  it("should throw an error if required fields are missing", async () => {
    emptyViolationData = {
      userId: "",
      reportedById: "",
      vehicleId: "",
      violationId: "",
      status: "UNPAID",
    }
    let errorMessage = "";
    try {
      await createViolationRecordUseCase.execute(emptyViolationData);
    } catch (error) {
      errorMessage = (error as Error).message;
    }

    expect(errorMessage).toBeTruthy();
  });
});
