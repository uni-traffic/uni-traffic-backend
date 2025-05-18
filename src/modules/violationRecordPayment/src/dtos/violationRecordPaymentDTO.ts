import type { IUserDTO } from "../../../user/src/dtos/userDTO";
import type { IViolationRecordDTO } from "../../../violationRecord/src/dtos/violationRecordDTO";

export interface IViolationRecordPaymentDTO {
  id: string;
  cashierId: string;
  violationRecordId: string;

  amountDue: number;
  cashTendered: number;
  change: number;
  totalAmountPaid: number;

  timePaid: Date;
  cashier: IUserDTO | null;
  violationRecord: IViolationRecordDTO | null;
}

export interface GetTotalFineCollectedPerDayByRangeUseCasePayload {
  startDate: Date;
  endDate: Date;
}

export type GetViolationRecordPaymentAmountAndTimePaid = {
  totalAmountPaid: number;
  timePaid: Date;
};
