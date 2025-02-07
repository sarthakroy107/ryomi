import { z } from "zod";

export const CreditUsageSchema = z.object({
  currentAmount: z.number(),
  recentUsage: z.object({
    creditsUsed: z.number(),
    dates: z.object({
      start: z.string(),
      end: z.string(),
    }),
    usage: z.array(
      z.object({
        date: z.string(),
        used: z.number(),
      })
    ),
    // categoryPercentage: z.array(
    //   z.object({
    //     category: z.string(),
    //     percentage: z.number(),
    //   })
    // ),
  }),
});

export type TCreditUsage = z.infer<typeof CreditUsageSchema>;