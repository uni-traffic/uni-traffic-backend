import type { GetViolationRecordPaymentAmountAndTimePaid } from "../../modules/violationRecordPayment/src/dtos/violationRecordPaymentDTO";

export const combineDate = (payments: GetViolationRecordPaymentAmountAndTimePaid[]) => {
  return payments.reduce((acc, payment) => {
    const dateKey = payment.timePaid.toISOString().split("T")[0];
    if (!acc.includes(dateKey)) {
      acc.push(dateKey);
    }
    return acc;
  }, [] as string[]);
};
