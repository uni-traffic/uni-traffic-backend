import z from "zod";

export const GetUserSignInActivityByRangeRequest = z.object({
  startDate: z.string({ message: "Start Date is required" }),
  endDate: z.string({ message: "End Date is required" })
});
export type UserSignInActivityByRangeRequest = z.infer<typeof GetUserSignInActivityByRangeRequest>;

export const GetTotalUniqueSignInByGivenRangeRequest = z.object({
  startDate: z.string({ message: "Start Date is required" }),
  endDate: z.string({ message: "End Date is required" }),
  type: z.enum(["YEAR", "MONTH", "DAY"])
});
export type GetTotalUniqueSignInByGivenRange = z.infer<
  typeof GetTotalUniqueSignInByGivenRangeRequest
>;
