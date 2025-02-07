import { z } from "zod";

export const DashboardSchema = z.object({
  user: z.object({
    name: z.string(),
    email: z.string(),
    dp: z.string().nullable(),
    id: z.string(),
  }),
  credits: z.number(),
  uploadedFiles: z.number(),
  ongoingTasks: z.number(),
  nextDeletions: z.number(),
});
