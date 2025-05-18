import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { createUserPersistenceData } from "../../../../user/tests/utils/user/createUserPersistenceData";
import { createViolationRecordPersistenceData } from "../../../../violationRecord/tests/utils/violationRecord/createViolationRecordPersistenceData";
import type { IViolationRecordPaymentRawObject } from "../../../src/domain/models/violationRecordPayment/constant";

export const createViolationRecordPaymentPersistenceData = ({
  id = uuid(),
  cashierId = uuid(),
  violationRecordId = uuid(),
  timePaid = faker.date.past(),
  cashier = createUserPersistenceData({}),
  violationRecord = createViolationRecordPersistenceData({})
}: Partial<IViolationRecordPaymentRawObject>): IViolationRecordPaymentRawObject => {
  return {
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
  };
};
