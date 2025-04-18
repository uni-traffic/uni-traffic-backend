import type { IUserDTO } from "../../../user/src/dtos/userDTO";
import type { IVehicleDTO } from "../../../vehicle/src/dtos/vehicleDTO";
import type { IViolationDTO } from "../../../violation/src/dtos/violationDTO";
import type { IViolationRecordPaymentDTO } from "../../../violationRecordPayment/src/dtos/violationRecordPaymentDTO";

export interface IViolationRecordDTO {
  id: string;
  userId: string;
  reportedById: string;
  violationId: string;
  vehicleId: string;
  status: string;
  remarks: string;
  date: string;
  user: IUserDTO | null;
  reporter: IUserDTO | null;
  violation: IViolationDTO | null;
  vehicle: IVehicleDTO | null;
  payment: IViolationRecordPaymentDTO | null;
}

export interface ICreateViolationRecordInputUseCase {
  reportedById: string;
  violationId: string;
  vehicleId?: string;
  licensePlate?: string;
  stickerNumber?: string;
  remarks: string;
}

export type GetViolationRecordByProperty = {
  id?: string;
  vehicleId?: string;
  userId?: string;
  violationId?: string;
  reportedById?: string;
  status?: string;
  count?: number;
  page?: number;
};

export interface GetViolationsGivenPerDayByRangeParams {
  startDate: Date;
  endDate: Date;
}

export interface ShortenViolationRecord {
  id: string;
  createdAt: Date;
}

export interface UnpaidAndPaidViolationTotal {
  unpaidTotal: number;
  paidTotal: number;
}

export type ViolationGivenByRange = { date: string; count: number }[];

export interface GetTotalViolationGivenByRangeParams {
  startDate: Date;
  endDate: Date;
  type: "YEAR" | "MONTH" | "DAY";
}
