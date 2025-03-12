import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import type { IViolationRecordPaymentRawObject } from "../../../src/domain/models/violationRecordPayment/constant";
import { createUserPersistenceData } from "../../../../user/tests/utils/user/createUserPersistenceData";
import { createViolationRecordPersistenceData } from "../../../../violationRecord/tests/utils/violationRecord/createViolationRecordPersistenceData";

export const createViolationRecordPaymentPersistenceData = ({
  id = uuid(),
  cashierId = uuid(),
  violationRecordId = uuid(),
  amountPaid = faker.number.int({ min: 250, max: 1000 }),
  remarks = faker.lorem.sentence({ min: 5, max: 15 }),
  timePaid = faker.date.past(),
  cashier = createUserPersistenceData({}),
  violationRecord = createViolationRecordPersistenceData({})
}: Partial<IViolationRecordPaymentRawObject>): IViolationRecordPaymentRawObject => {
  return {
    id,
    cashierId,
    violationRecordId,
    amountPaid,
    remarks,
    timePaid,
    cashier,
    violationRecord
  };
};
