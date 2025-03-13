import { db } from "../../../../../shared/infrastructure/database/prisma";
import { ViolationRecordStatus } from "../../../src/domain/models/violationRecord/classes/violationRecordStatus";
import {
  IViolationRecordRepository,
  ViolationRecordRepository
} from "../../../src/repositories/violationRecordRepository";
import { seedViolationRecord } from "../../utils/violationRecord/seedViolationRecord";

describe("ViolationRecordRepository.updateViolationRecordStatus", () => {
  let violationRecordRepository: IViolationRecordRepository;

  beforeAll(async () => {
    violationRecordRepository = new ViolationRecordRepository();
  });

  beforeEach(async () => {
    await db.violationRecord.deleteMany();
  });

  it("should successfully update the status of an existing violation record", async () => {
    const seededViolationRecord = await seedViolationRecord({ status: "UNPAID" });
    const newStatus = ViolationRecordStatus.create("PAID").getValue(); 
  
    const updatedRecord = await violationRecordRepository.updateViolationRecordStatus(
      seededViolationRecord.id,
      newStatus
    );
  
    expect(updatedRecord).not.toBeNull();
    expect(updatedRecord!.status.value).toBe(newStatus.value); 
  });
  
  it("should return null if the violation record does not exist", async () => {
    const newStatus = ViolationRecordStatus.create("PAID").getValue(); 
    
    const result = await violationRecordRepository.updateViolationRecordStatus(
      "non-existent-id",
      newStatus
    );
  
    expect(result).toBeNull();
  });  
});
