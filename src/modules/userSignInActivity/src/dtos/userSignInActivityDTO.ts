import type { IUserDTO } from "../../../user/src/dtos/userDTO";

export interface IUserSignInActivityDTO {
  id: string;
  userId: string;
  time: Date;
  user?: IUserDTO | null;
}

export interface GetUserSignInActivityByRange {
  startDate: Date;
  endDate: Date;
}

export type TotalUniqueSignInByGivenRange = { date: string; count: number }[];

export interface GetTotalUniqueSignInByGivenRangeParams {
  startDate: Date;
  endDate: Date;
  type: "YEAR" | "MONTH" | "DAY";
}
