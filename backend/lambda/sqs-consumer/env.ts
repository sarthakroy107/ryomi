import { config } from "dotenv";
import { z } from "zod";

config();

const EnvSchema = z.object({
  AWS_RYOMI_VPC_SG_1: z.string(),
  AWS_RYOMI_VPC_SUBNET_A: z.string(),
  AWS_ECS_CLUSTER_NAME: z.string(),
  AWS_ECS_TASK_DEFINITION: z.string(),
  AWS_ECS_ML_TASK_DEFINITION: z.string(),
});

export type SQSConsumerEnv = z.infer<typeof EnvSchema>;

const sqsConsumerEnv = EnvSchema.parse(process.env);

// const { error, data: sqsConsumerEnv } = result;

// if (error) {
//   console.error("❌ Invalid env:");
//   console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
//   process.exit(1);
// }

export { sqsConsumerEnv };