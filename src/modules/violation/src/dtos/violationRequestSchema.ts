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

export const GetViolationRequestSchema = z.object({
  id: z.string().optional(),
  category: z.string().optional(),
  violationName: z.string().optional(),
  isDeleted: z.enum(["true", "false"]).optional(),
  sort: z.enum(["1", "2"]).optional(),
  searchKey: z.string().optional(),
  count: z.string().refine(
    (val) => {
      const num = Number(val);
      return !Number.isNaN(num) && Number.isInteger(num) && num > 0;
    },
    {
      message: '"count" must be a valid positive whole number'
    }
  ),
  page: z.string().refine(
    (val) => {
      const num = Number(val);
      return !Number.isNaN(num) && Number.isInteger(num) && num > 0;
    },
    {
      message: '"page" must be a valid positive whole number'
    }
  )
});
export type GetViolationRequest = z.infer<typeof GetViolationRequestSchema>;
