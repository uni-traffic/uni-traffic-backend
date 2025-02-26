import { faker } from "@faker-js/faker";
import { UserViolation } from "../../../../src/domain/models/userViolation/classes/userViolation";
import {
  type IUserViolationMapper,
  UserViolationMapper
} from "../../../../src/domain/models/userViolation/mapper";
import { createUserViolationDomainObject } from "../../../utils/userViolation/createUserViolationDomainObject";
import { PaymentStatus } from "@prisma/client";

describe("UserViolationMapper", () => {
  let userViolationMapper: IUserViolationMapper;

  beforeAll(() => {
    userViolationMapper = new UserViolationMapper();
  });

  it("should map to domain from persistence data", () => {
    const userViolationSchemaObject = {
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

    const userViolationDomainObject = createUserViolationDomainObject(userViolationSchemaObject);

    expect(userViolationDomainObject).toBeInstanceOf(UserViolation);
    expect(userViolationDomainObject.id).toBe(userViolationSchemaObject.id);
    expect(userViolationDomainObject.userId).toBe(userViolationSchemaObject.userId);
    expect(userViolationDomainObject.reportedById).toBe(userViolationSchemaObject.reportedById);
    expect(userViolationDomainObject.violationId).toBe(userViolationSchemaObject.violationId);
    expect(userViolationDomainObject.vehicleId).toBe(userViolationSchemaObject.vehicleId);
    expect(userViolationDomainObject.status).toBe(userViolationSchemaObject.status);
    expect(userViolationDomainObject.reporter).toEqual(userViolationSchemaObject.reporter);
    expect(userViolationDomainObject.violation).toEqual(userViolationSchemaObject.violation);
    expect(userViolationDomainObject.vehicle).toEqual(userViolationSchemaObject.vehicle);
  });

  it("should map to persistence from domain", () => {
    const userViolationDomainObject = createUserViolationDomainObject({});
    const userViolationSchemaObject = userViolationMapper.toPersistence(userViolationDomainObject);

    expect(userViolationSchemaObject.id).toBe(userViolationDomainObject.id);
    expect(userViolationSchemaObject.userId).toBe(userViolationDomainObject.userId);
    expect(userViolationSchemaObject.reportedById).toBe(userViolationDomainObject.reportedById);
    expect(userViolationSchemaObject.violationId).toBe(userViolationDomainObject.violationId);
    expect(userViolationSchemaObject.vehicleId).toBe(userViolationDomainObject.vehicleId);
    expect(userViolationSchemaObject.status).toBe(userViolationDomainObject.status);
    expect(userViolationSchemaObject.reporter).toEqual(userViolationDomainObject.reporter);
    expect(userViolationSchemaObject.violation).toEqual(userViolationDomainObject.violation);
    expect(userViolationSchemaObject.vehicle).toEqual(userViolationDomainObject.vehicle);
  });

  it("should map to DTO from domain", () => {
    const userViolationDomainObject = createUserViolationDomainObject({});
    const userViolationDTO = userViolationMapper.toDTO(userViolationDomainObject);

    expect(userViolationDTO.id).toBe(userViolationDomainObject.id);
    expect(userViolationDTO.userId).toBe(userViolationDomainObject.userId);
    expect(userViolationDTO.reportedById).toBe(userViolationDomainObject.reportedById);
    expect(userViolationDTO.violationId).toBe(userViolationDomainObject.violationId);
    expect(userViolationDTO.vehicleId).toBe(userViolationDomainObject.vehicleId);
    expect(userViolationDTO.status).toBe(userViolationDomainObject.status);
    expect(userViolationDTO.reporter).toEqual(userViolationDomainObject.reporter);
    expect(userViolationDTO.violation).toEqual(userViolationDomainObject.violation);
    expect(userViolationDTO.vehicle).toEqual(userViolationDomainObject.vehicle);
  });
});