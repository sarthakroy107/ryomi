import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import { SQSMessageBodySchema } from "@/lib/zod/sqs-message-body";
import { sqsConsumerEnv } from "./env";
import { createMLTask, createNormalTask } from "./ecs-tasks";

const ecsClient = new ECSClient({ region: "ap-south-1" });

export async function handler(events: any) {
  try {
    const {
      AWS_RYOMI_VPC_SG_1,
      AWS_RYOMI_VPC_SUBNET_A,
      AWS_ECS_CLUSTER_NAME,
      AWS_ECS_TASK_DEFINITION,
    } = sqsConsumerEnv;

    if (
      !AWS_RYOMI_VPC_SG_1 ||
      !AWS_RYOMI_VPC_SUBNET_A ||
      !AWS_ECS_CLUSTER_NAME ||
      !AWS_ECS_TASK_DEFINITION
    ) {
      console.error("Environment variables not set");
      return;
    }

    const { Records } = events;

    if (!Records) {
      return;
    }

    for (const record of Records) {
      const body = JSON.parse(record.body);

      const result = SQSMessageBodySchema.safeParse(body);

      if (!result.success) {
        console.error(result.error.errors);
        return;
      }

      console.log(result.data);

      if (
        !result.data.transcode &&
        !result.data.convert &&
        !result.data.subtitles
      ) {
        console.error("No operation found");
        return;
      }

      let runTaskCommand: RunTaskCommand;

      if (!result.data.subtitles) {
        runTaskCommand = createNormalTask(result.data);
        await ecsClient.send(runTaskCommand);
      } else {
        runTaskCommand = createMLTask(result.data);
        await ecsClient.send(runTaskCommand);
      }
    }
  } catch (error) {
    console.error(error);
  }
}
