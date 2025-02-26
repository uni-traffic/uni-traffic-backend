import { faker } from "@faker-js/faker";
import { Violation } from "../../../../../src/domain/models/violation/classes/violation";

describe("Violation", () => {
  it("should create a Violation", () => {
    const mockViolationData: {
      id: string;
      category: string;
      violationName: string;
      penalty: number;
    } = {
      id: faker.string.uuid(),
      category: "A",
      violationName: "Illegal Parking",
      penalty: 250
    };

    const violation = Violation.create(mockViolationData);

    expect(violation).toBeInstanceOf(Violation);
    expect(violation.id).toBe(mockViolationData.id);
    expect(violation.category).toBe(mockViolationData.category);
    expect(violation.violationName).toBe(mockViolationData.violationName);
    expect(violation.penalty).toBe(mockViolationData.penalty);
  });
});
