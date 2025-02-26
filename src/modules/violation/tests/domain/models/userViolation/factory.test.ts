import { faker } from "@faker-js/faker";
import { UserViolation } from "../../../../src/domain/models/userViolation/classes/userViolation";
import {
  type IUserViolationFactoryProps,
  UserViolationFactory
} from "../../../../src/domain/models/userViolation/factory";

describe("UserViolationFactory", () => {
  let mockUserViolationData: IUserViolationFactoryProps;

  beforeEach(() => {
    mockUserViolationData = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      reportedById: faker.string.uuid(),
      violationId: faker.string.uuid(),
      vehicleId: faker.string.uuid()
    };
  });

  it("should successfully create a UserViolation when all properties are valid", () => {
    const result = UserViolationFactory.create(mockUserViolationData);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(UserViolation);

    const userViolation = result.getValue();
    expect(userViolation.id).toBe(mockUserViolationData.id);
    expect(userViolation.userId).toBe(mockUserViolationData.userId);
    expect(userViolation.reportedById).toBe(mockUserViolationData.reportedById);
    expect(userViolation.violationId).toBe(mockUserViolationData.violationId);
    expect(userViolation.vehicleId).toBe(mockUserViolationData.vehicleId);
  });
});
