import { AmountDue } from "../../../../src/domain/classes/amountDue";

describe("AmountDue", () => {
  it("should create a valid AmountDue when given a positive value", () => {
    const amount = 500;
    const result = AmountDue.create(amount);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(AmountDue);
    expect(result.getValue().value).toBe(amount);
  });

  it("should fail to create AmountDue when given zero", () => {
    const result = AmountDue.create(0);

    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe("Amount due must be greater than zero.");
  });

  it("should fail to create AmountDue when given a negative value", () => {
    const result = AmountDue.create(-100);

    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe("Amount due must be greater than zero.");
  });
});
