import z from "zod";

export const AuditLogGetRequestSchema = z.object({
  objectId: z.string().optional(),
  actorId: z.string().optional(),
  actionType: z.enum(["CREATE", "UPDATE", "DELETE"]).optional(),
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
export type GetAuditLogRequest = z.infer<typeof AuditLogGetRequestSchema>;
