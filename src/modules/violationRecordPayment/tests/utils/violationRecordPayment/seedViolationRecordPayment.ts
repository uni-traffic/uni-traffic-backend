import { faker } from "@faker-js/faker";
import { defaultTo } from "rambda";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { uniTrafficId } from "../../../../../shared/lib/uniTrafficId";
import type { IUserRawObject } from "../../../../user/src/domain/models/user/constant";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import type { IViolationRecordRawObject } from "../../../../violationRecord/src/domain/models/violationRecord/constant";
import { seedViolationRecord } from "../../../../violationRecord/tests/utils/violationRecord/seedViolationRecord";
import type { IViolationRecordPaymentFactoryProps } from "../../../src/domain/models/violationRecordPayment/factory";

export const seedViolationRecordPayment = async ({
  id = uniTrafficId(),
  cashierId,
  violationRecordId,
  totalAmountPaid = faker.number.int({ min: 100, max: 1000 }),
  timePaid = new Date()
}: Partial<IViolationRecordPaymentFactoryProps> & {
  cashier?: Partial<IUserRawObject>;
  violationRecord?: Partial<IViolationRecordRawObject>;
}) => {
  const seededViolationRecordId = violationRecordId
    ? violationRecordId
    : (await seedViolationRecord({ status: "UNPAID" })).id;
  const seededCashier = await seedUser({ role: "STAFF" });

  return db.violationRecordPayment.create({
    data: {
      id,
      cashTendered: totalAmountPaid,
      amountDue: totalAmountPaid,
      change: 0,
      totalAmountPaid: totalAmountPaid,
      timePaid,
      cashierId: defaultTo(seededCashier.id, cashierId),
      violationRecordId: seededViolationRecordId
    },
    include: {
      cashier: true,
      violationRecord: {
        include: {
          user: true,
          vehicle: true,
          violation: true
        }
      }
    }
  });
};
