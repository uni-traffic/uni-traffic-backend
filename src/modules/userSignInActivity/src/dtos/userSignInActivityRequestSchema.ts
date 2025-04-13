import z from "zod";

export const GetUserSignInActivityByRangeRequest = z.object({
  startDate: z.string({ message: "Start Date is required" }),
  endDate: z.string({ message: "End Date is required" })
});
export type UserSignInActivityByRangeRequest = z.infer<typeof GetUserSignInActivityByRangeRequest>;
