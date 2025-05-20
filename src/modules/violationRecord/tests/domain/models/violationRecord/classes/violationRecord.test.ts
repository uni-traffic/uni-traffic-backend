import { faker } from "@faker-js/faker";
import { ViolationRecord } from "../../../../../src/domain/models/violationRecord/classes/violationRecord";
import { ViolationRecordRemarks } from "../../../../../src/domain/models/violationRecord/classes/violationRecordRemarks";
import { ViolationRecordStatus } from "../../../../../src/domain/models/violationRecord/classes/violationRecordStatus";

describe("ViolationRecord", () => {
  it("should create a ViolationRecord", () => {
    const penalty = faker.number.int({ min: 100, max: 1000 });
    const mockViolationRecordData = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      reportedById: faker.string.uuid(),
      violationId: faker.string.uuid(),
      createdAt: new Date(),
      vehicleId: faker.string.uuid(),
      penalty: penalty,
      evidence: [faker.image.url()],
      status: ViolationRecordStatus.create(
        faker.helpers.arrayElement(["UNPAID", "PAID"])
      ).getValue(),
      remarks: ViolationRecordRemarks.create(faker.lorem.sentence({ min: 5, max: 15 })).getValue(),
      user: {
        id: faker.string.uuid(),
        username: faker.person.fullName(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role: faker.helpers.arrayElement(["STUDENT", "SECURITY", "ADMIN", "STAFF"])
      },
      reporter: {
        id: faker.string.uuid(),
        username: faker.person.fullName(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role: faker.helpers.arrayElement(["STUDENT", "SECURITY", "ADMIN", "STAFF"])
      },
      violation: {
        id: faker.string.uuid(),
        category: faker.helpers.arrayElement(["A", "B", "C"]),
        violationName: faker.lorem.words(3),
        penalty: penalty,
        isDeleted: false
      }
    };

    const violationRecord = ViolationRecord.create(mockViolationRecordData);

    expect(violationRecord).toBeInstanceOf(ViolationRecord);
    expect(violationRecord).toMatchObject(mockViolationRecordData);
  });
});
