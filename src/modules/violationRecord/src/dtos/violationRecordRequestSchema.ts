import z from "zod";
import { ViolationRecordStatus } from "@prisma/client"; 

export const ViolationRecordSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  reportedById: z.string().uuid(),
  violationId: z.string().uuid(),
  vehicleId: z.string().uuid(),
  status: z.enum([
    ViolationRecordStatus.UNPAID, 
    ViolationRecordStatus.PAID
  ]),
});

export type ViolationRecordRequest = z.infer<typeof ViolationRecordSchema>;