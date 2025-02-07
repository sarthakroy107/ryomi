import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  DATABASE_URL: z.string(),
  AWS_S3_BUCKET_NAME: z.string(),
  AWS_SQS_URL: z.string(),
  AWS_S3_INPUT_BUCKET_NAME: z.string(),
  AWS_S3_OUTPUT_BUCKET_NAME: z.string(),
  RAZORPAY_KEYID: z.string(),
  RAZORPAY_KEYSECRET: z.string(),
});

export type HonoEnv = z.infer<typeof envSchema>;

const honoEnv = envSchema.parse(process.env);

// const { error, data: honoEnv } = result;

// if (error) {
//   console.error("❌ Invalid env:");
//   console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
//   process.exit(1);
// }

export { honoEnv };
