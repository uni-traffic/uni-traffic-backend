import { faker } from "@faker-js/faker";
import { VehicleStatus } from "../../../../../../vehicle/src/domain/models/vehicle/classes/vehicleStatus";
import {
  type IViolationRecord,
  ViolationRecord
} from "../../../../../src/domain/models/violationRecord/classes/violationRecord";
import { ViolationRecordRemarks } from "../../../../../src/domain/models/violationRecord/classes/violationRecordRemarks";
import { ViolationRecordStatus } from "../../../../../src/domain/models/violationRecord/classes/violationRecordStatus";

describe("ViolationRecord", () => {
  it("should create a ViolationRecord", () => {
    const mockViolationRecordData: IViolationRecord = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      reportedById: faker.string.uuid(),
      violationId: faker.string.uuid(),
      createdAt: new Date(),
      vehicleId: faker.string.uuid(),
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
        penalty: faker.number.int({ min: 100, max: 1000 })
      },
      vehicle: {
        id: faker.string.uuid(),
        ownerId: faker.string.uuid(),
        licensePlate: faker.vehicle.vrm().toUpperCase(),
        make: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        series: faker.vehicle.type(),
        color: faker.color.human(),
        stickerNumber: "12345678",
        status: faker.helpers.arrayElement(VehicleStatus.validVehicleStatus),
        type: faker.helpers.arrayElement(["Car", "Motorcycle"]),
        images: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
          faker.image.url()
        ),
        owner: null
      }
    };

    const violationRecord = ViolationRecord.create(mockViolationRecordData);

    expect(violationRecord).toBeInstanceOf(ViolationRecord);
    expect(violationRecord.id).toBe(mockViolationRecordData.id);
    expect(violationRecord.userId).toBe(mockViolationRecordData.userId);
    expect(violationRecord.reportedById).toBe(mockViolationRecordData.reportedById);
    expect(violationRecord.violationId).toBe(mockViolationRecordData.violationId);
    expect(violationRecord.vehicleId).toBe(mockViolationRecordData.vehicleId);
    expect(violationRecord.status).toBe(mockViolationRecordData.status);
    expect(violationRecord.reporter).toEqual(mockViolationRecordData.reporter);
    expect(violationRecord.violation).toEqual(mockViolationRecordData.violation);
    expect(violationRecord.vehicle).toEqual(mockViolationRecordData.vehicle);
  });
});
