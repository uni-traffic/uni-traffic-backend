import z from "zod";

export const ViolationCreateRequestSchema = z.object({
  category: z.string().min(1, "Category cannot be empty"),
  violationName: z.string().min(1, "Violation name cannot be empty"),
  penalty: z.number().nonnegative("Penalty must be a non-negative number")
});

export type ViolationCreateRequest = z.infer<typeof ViolationCreateRequestSchema>;
