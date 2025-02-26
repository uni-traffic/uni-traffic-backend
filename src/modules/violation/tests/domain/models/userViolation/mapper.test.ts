import { faker } from "@faker-js/faker";
import { UserViolation } from "../../../../src/domain/models/userViolation/classes/userViolation";
import {
  type IUserViolationMapper,
  UserViolationMapper
} from "../../../../src/domain/models/userViolation/mapper";
import { createUserViolationDomainObject } from "../../../utils/userViolation/createUserViolationDomainObject";

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
      vehicleId: faker.string.uuid()
    };

    const userViolationDomainObject = userViolationMapper.toDomain(userViolationSchemaObject);

    expect(userViolationDomainObject).toBeInstanceOf(UserViolation);
    expect(userViolationDomainObject.id).toBe(userViolationSchemaObject.id);
    expect(userViolationDomainObject.userId).toBe(userViolationSchemaObject.userId);
    expect(userViolationDomainObject.reportedById).toBe(userViolationSchemaObject.reportedById);
    expect(userViolationDomainObject.violationId).toBe(userViolationSchemaObject.violationId);
    expect(userViolationDomainObject.vehicleId).toBe(userViolationSchemaObject.vehicleId);
  });

  it("should map to persistence from domain", () => {
    const userViolationDomainObject = createUserViolationDomainObject({});
    const userViolationSchemaObject = userViolationMapper.toPersistence(userViolationDomainObject);

    expect(userViolationSchemaObject.id).toBe(userViolationDomainObject.id);
    expect(userViolationSchemaObject.userId).toBe(userViolationDomainObject.userId);
    expect(userViolationSchemaObject.reportedById).toBe(userViolationDomainObject.reportedById);
    expect(userViolationSchemaObject.violationId).toBe(userViolationDomainObject.violationId);
    expect(userViolationSchemaObject.vehicleId).toBe(userViolationDomainObject.vehicleId);
  });

  it("should map to DTO from domain", () => {
    const userViolationDomainObject = createUserViolationDomainObject({});
    const userViolationDTO = userViolationMapper.toDTO(userViolationDomainObject);

    expect(userViolationDTO.id).toBe(userViolationDomainObject.id);
    expect(userViolationDTO.userId).toBe(userViolationDomainObject.userId);
    expect(userViolationDTO.reportedById).toBe(userViolationDomainObject.reportedById);
    expect(userViolationDTO.violationId).toBe(userViolationDomainObject.violationId);
    expect(userViolationDTO.vehicleId).toBe(userViolationDomainObject.vehicleId);
  });
});
