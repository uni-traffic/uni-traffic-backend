import { faker } from "@faker-js/faker";
import { UserViolation } from "../../../../src/domain/models/userViolation/classes/userViolation";
import { PaymentStatus } from "@prisma/client";
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
      vehicleId: faker.string.uuid(),
      status: PaymentStatus.UNPAID,
      reporter: {
        id: faker.string.uuid(),
        username: faker.person.fullName(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role: faker.helpers.arrayElement(["STUDENT", "SECURITY", "ADMIN", "STAFF"]),
      },
      violation: {
        id: faker.string.uuid(),
        category: faker.helpers.arrayElement(["A", "B", "C"]),
        violationName: faker.lorem.words(3),
        penalty: faker.number.int({ min: 100, max: 1000 }),
      },
      vehicle: {
        id: faker.string.uuid(),
        ownerId: faker.string.uuid(),
        licensePlate: faker.vehicle.vrm().toUpperCase(),
        make: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        series: faker.vehicle.type(),
        color: faker.color.human(),
        type: faker.helpers.arrayElement(["Car", "Motorcycle"]),
        images: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.image.url()),
        stickerNumber: faker.string.alphanumeric(8).toUpperCase(),
        isActive: faker.datatype.boolean(),
        owner: {
          id: faker.string.uuid(),
          username: faker.person.fullName(),
          email: faker.internet.email(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          role: faker.helpers.arrayElement(["STUDENT", "SECURITY", "ADMIN", "STAFF"]),
        },
      },
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
    expect(userViolation.status).toBe(mockUserViolationData.status);
    expect(userViolation.reporter).toEqual(mockUserViolationData.reporter);
    expect(userViolation.violation).toEqual(mockUserViolationData.violation);
    expect(userViolation.vehicle).toEqual(mockUserViolationData.vehicle);
  });
});
