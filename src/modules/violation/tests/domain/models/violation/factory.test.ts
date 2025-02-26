import { Violation } from "../../../../src/domain/models/violation/classes/violation";
import {
  type IViolationFactoryProps,
  ViolationFactory
} from "../../../../src/domain/models/violation/factory";
import { faker } from "@faker-js/faker";

describe("ViolationFactory", () => {
  let mockViolationData: IViolationFactoryProps;

  beforeEach(() => {
    mockViolationData = {
      id: faker.string.uuid(),
      category: "A",
      violationName: " ",
      penalty: 250
    };
  });

  it("should successfully create a Violation when all properties are valid", () => {
    const result = ViolationFactory.create(mockViolationData);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(Violation);

    const violation = result.getValue();
    expect(violation.id).toBe(mockViolationData.id);
    expect(violation.category).toBe(mockViolationData.category);
    expect(violation.violationName).toBe(mockViolationData.violationName);
    expect(violation.penalty).toBe(mockViolationData.penalty);
  });
});
