import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { createUserPersistenceData } from "../../../../user/tests/utils/user/createUserPersistenceData";
import { createViolationRecordPersistenceData } from "../../../../violationRecord/tests/utils/violationRecord/createViolationRecordPersistenceData";
import type { IViolationRecordPayment } from "../../../src/domain/models/violationRecordPayment/classes/violationRecordPayment";
import type { IViolationRecordPaymentRawObject } from "../../../src/domain/models/violationRecordPayment/constant";
import { ViolationRecordPaymentFactory } from "../../../src/domain/models/violationRecordPayment/factory";

export const createViolationRecordPaymentDomainObject = ({
  id = uuid(),
  cashierId = uuid(),
  violationRecordId = uuid(),
  timePaid = faker.date.past(),
  cashier = createUserPersistenceData({}),
  violationRecord = createViolationRecordPersistenceData({})
}: Partial<IViolationRecordPaymentRawObject>): IViolationRecordPayment => {
  const violationRecordPaymentOrError = ViolationRecordPaymentFactory.create({
    id,
    cashierId,
    violationRecordId,
    cashTendered: violationRecord.penalty,
    amountDue: violationRecord.penalty,
    change: 0,
    totalAmountPaid: violationRecord.penalty,
    timePaid,
    cashier,
    violationRecord
  });

  if (violationRecordPaymentOrError.isFailure) {
    throw new Error(violationRecordPaymentOrError.getErrorMessage()!);
  }

  return violationRecordPaymentOrError.getValue();
};
