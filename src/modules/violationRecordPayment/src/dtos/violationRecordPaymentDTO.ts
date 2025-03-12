import type { IUserDTO } from "../../../user/src/dtos/userDTO";
import type { IViolationRecordDTO } from "../../../violationRecord/src/dtos/violationRecordDTO";

export interface IViolationRecordPaymentDTO {
  id: string;
  cashierId: string;
  violationRecordId: string;
  amountPaid: number;
  remarks: string | null;
  timePaid: Date;
  cashier: IUserDTO | null;
  violationRecord: IViolationRecordDTO | null;
}
