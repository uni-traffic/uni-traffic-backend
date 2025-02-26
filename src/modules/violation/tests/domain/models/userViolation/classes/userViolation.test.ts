import { faker } from "@faker-js/faker";
import { UserViolation } from "../../../../../src/domain/models/userViolation/classes/userViolation";

describe("UserViolation", () => {
  it("should create a UserViolation", () => {
    const mockUserViolationData: {
      id: string;
      userId: string;
      reportedById: string;
      violationId: string;
      vehicleId: string;
    } = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      reportedById: faker.string.uuid(),
      violationId: faker.string.uuid(),
      vehicleId: faker.string.uuid()
    };

    const userViolation = UserViolation.create(mockUserViolationData);

    expect(userViolation).toBeInstanceOf(UserViolation);
    expect(userViolation.id).toBe(mockUserViolationData.id);
    expect(userViolation.userId).toBe(mockUserViolationData.userId);
    expect(userViolation.reportedById).toBe(mockUserViolationData.reportedById);
    expect(userViolation.violationId).toBe(mockUserViolationData.violationId);
    expect(userViolation.vehicleId).toBe(mockUserViolationData.vehicleId);
  });
});
