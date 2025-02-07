import { z } from "zod";

const s3UplaodEventSchema = z.object({
  DATABASE_URL: z.string(),
});

export const s3UplaodEventEnv = s3UplaodEventSchema.parse(process.env);
