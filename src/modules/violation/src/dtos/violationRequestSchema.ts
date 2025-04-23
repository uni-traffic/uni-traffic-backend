import z from "zod";

export const ViolationCreateRequestSchema = z.object({
  category: z.string().min(1, "Category cannot be empty"),
  violationName: z.string().min(1, "Violation name cannot be empty"),
  penalty: z.number().nonnegative("Penalty must be a non-negative number")
});

export type ViolationCreateRequest = z.infer<typeof ViolationCreateRequestSchema>;

export const UpdateViolationRequestSchema = z.object({
  id: z.string(),
  category: z.string().optional(),
  violationName: z.string().optional(),
  penalty: z.number().optional()
});

export type UpdateViolationCreateRequest = z.infer<typeof UpdateViolationRequestSchema>;

export const ViolationDeleteRequestSchema = z.object({
  id: z.string().min(1, "Violation ID is required")
});

export type ViolationDeleteRequest = z.infer<typeof ViolationDeleteRequestSchema>;
