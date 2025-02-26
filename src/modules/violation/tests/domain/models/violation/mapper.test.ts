import { faker } from "@faker-js/faker";
import { Violation } from "../../../../src/domain/models/violation/classes/violation";
import {
  type IViolationMapper,
  ViolationMapper
} from "../../../../src/domain/models/violation/mapper";
import { createViolationDomainObject } from "../../../utils/violation/createViolationDomainObject";

describe("ViolationMapper", () => {
  let violationMapper: IViolationMapper;

  beforeAll(() => {
    violationMapper = new ViolationMapper();
  });

  it("should map to domain from persistence data", () => {
    const violationSchemaObject = {
      id: faker.string.uuid(),
      category: faker.helpers.arrayElement(["A", "B", "C"]),
      violationName: faker.lorem.words(3),
      penalty: faker.number.int({ min: 100, max: 1000 })
    };

    const violationDomainObject = violationMapper.toDomain(violationSchemaObject);

    expect(violationDomainObject).toBeInstanceOf(Violation);
    expect(violationDomainObject.id).toBe(violationSchemaObject.id);
    expect(violationDomainObject.category).toBe(violationSchemaObject.category);
    expect(violationDomainObject.violationName).toBe(violationSchemaObject.violationName);
    expect(violationDomainObject.penalty).toBe(violationSchemaObject.penalty);
  });

  it("should map to persistence from domain", () => {
    const violationDomainObject = createViolationDomainObject({});
    const violationSchemaObject = violationMapper.toPersistence(violationDomainObject);

    expect(violationSchemaObject.id).toBe(violationDomainObject.id);
    expect(violationSchemaObject.category).toBe(violationDomainObject.category);
    expect(violationSchemaObject.violationName).toBe(violationDomainObject.violationName);
    expect(violationSchemaObject.penalty).toBe(violationDomainObject.penalty);
  });

  it("should map to DTO from domain", () => {
    const violationDomainObject = createViolationDomainObject({});
    const violationDTO = violationMapper.toDTO(violationDomainObject);

    expect(violationDTO.id).toBe(violationDomainObject.id);
    expect(violationDTO.category).toBe(violationDomainObject.category);
    expect(violationDTO.violationName).toBe(violationDomainObject.violationName);
    expect(violationDTO.penalty).toBe(violationDomainObject.penalty);
  });
});
