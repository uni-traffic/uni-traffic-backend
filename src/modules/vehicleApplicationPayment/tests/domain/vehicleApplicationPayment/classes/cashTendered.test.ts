import { CashTendered } from "../../../../src/domain/classes/cashTendered";
import { AmountDue } from "../../../../src/domain/classes/amountDue";

describe("CashTendered", () => {
  it("should create a valid CashTendered when cash is equal to amount due", () => {
    const amountDueResult = AmountDue.create(500);
    const cashTenderedResult = CashTendered.create(500, amountDueResult.getValue());

    expect(cashTenderedResult.isSuccess).toBe(true);
    expect(cashTenderedResult.getValue()).toBeInstanceOf(CashTendered);
    expect(cashTenderedResult.getValue().value).toBe(500);
  });

  it("should create a valid CashTendered when cash is greater than amount due", () => {
    const amountDueResult = AmountDue.create(500);
    const cashTenderedResult = CashTendered.create(600, amountDueResult.getValue());

    expect(cashTenderedResult.isSuccess).toBe(true);
    expect(cashTenderedResult.getValue()).toBeInstanceOf(CashTendered);
    expect(cashTenderedResult.getValue().value).toBe(600);
  });

  it("should fail to create CashTendered when cash is less than amount due", () => {
    const amountDueResult = AmountDue.create(500);
    const cashTenderedResult = CashTendered.create(400, amountDueResult.getValue());

    expect(cashTenderedResult.isFailure).toBe(true);
    expect(cashTenderedResult.getErrorMessage()).toBe(
      "Cash tendered must be equal to or greater than the amount due."
    );
  });
});
