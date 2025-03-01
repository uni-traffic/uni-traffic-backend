import z from "zod";
import { ViolationRecordStatus } from "@prisma/client"; 

export const ViolationRecordSchema = z.object({
  userId: z.string().uuid(),
  reportedById: z.string().uuid().optional(),
  violationId: z.string().uuid(),
  vehicleId: z.string().uuid(),
  status: z.enum([
    ViolationRecordStatus.UNPAID, 
    ViolationRecordStatus.PAID
  ]).optional(),
});

export type ViolationRecordRequest = z.infer<typeof ViolationRecordSchema>;