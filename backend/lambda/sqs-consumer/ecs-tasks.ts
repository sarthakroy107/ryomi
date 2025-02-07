import { SQSMessageBody } from "@/lib/zod/sqs-message-body";
import { sqsConsumerEnv } from "./env";
import { RunTaskCommand } from "@aws-sdk/client-ecs";

export function createNormalTask(data: SQSMessageBody) {
  const {
    AWS_RYOMI_VPC_SG_1,
    AWS_RYOMI_VPC_SUBNET_A,
    AWS_ECS_CLUSTER_NAME,
    AWS_ECS_TASK_DEFINITION,
  } = sqsConsumerEnv;

  if (data.subtitles) {
    throw new Error(
      "Invalid operation: Subtitles not supported in normal task"
    );
  }

  const runTaskCommand = new RunTaskCommand({
    cluster: AWS_ECS_CLUSTER_NAME,
    taskDefinition: AWS_ECS_TASK_DEFINITION,
    launchType: "FARGATE",
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: [AWS_RYOMI_VPC_SUBNET_A],
        securityGroups: [AWS_RYOMI_VPC_SG_1],
        assignPublicIp: "ENABLED",
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: "base-image",
          environment: [
            {
              name: "DOWNLOAD_OBJECT_COMMAND",
              value: data.objectDownloadCommand,
            },
            {
              name: "TRANSCODE_FFMPEG_COMMAND",
              value: data.transcode?.ffmpegCommand,
            },
            {
              name: "TRANSCODE_UPLOAD_OUTPUT_OBJECTS_COMMAND",
              value: data.transcode?.outputUploadCommand,
            },
            {
              name: "CONVERT_FFMPEG_COMMAND",
              value: data.convert?.ffmpegCommand,
            },
            {
              name: "CONVERT_UPLOAD_OUTPUT_OBJECTS_COMMAND",
              value: data.convert?.outputUploadCommand,
            },
          ],
        },
      ],
      cpu: data.compute.cpu,
      memory: data.compute.memory,
    },
  });

  return runTaskCommand;
}

export function createMLTask(data: SQSMessageBody) {
  const {
    AWS_RYOMI_VPC_SG_1,
    AWS_RYOMI_VPC_SUBNET_A,
    AWS_ECS_CLUSTER_NAME,
    AWS_ECS_ML_TASK_DEFINITION,
  } = sqsConsumerEnv;

  const runTaskCommand = new RunTaskCommand({
    cluster: AWS_ECS_CLUSTER_NAME,
    taskDefinition: AWS_ECS_ML_TASK_DEFINITION,
    launchType: "FARGATE",
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: [AWS_RYOMI_VPC_SUBNET_A],
        securityGroups: [AWS_RYOMI_VPC_SG_1],
        assignPublicIp: "ENABLED",
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: "ryomi-ml",
          environment: [
            {
              name: "DOWNLOAD_OBJECT_COMMAND",
              value: data.objectDownloadCommand,
            },
            {
              name: "TRANSCODE_FFMPEG_COMMAND",
              value: data.transcode?.ffmpegCommand,
            },
            {
              name: "TRANSCODE_UPLOAD_OUTPUT_OBJECTS_COMMAND",
              value: data.transcode?.outputUploadCommand,
            },
            {
              name: "CONVERT_FFMPEG_COMMAND",
              value: data.convert?.ffmpegCommand,
            },
            {
              name: "CONVERT_UPLOAD_OUTPUT_OBJECTS_COMMAND",
              value: data.convert?.outputUploadCommand,
            },
            {
              name: "SUBTITLES_FFMPEG_COMMAND",
              value: data.subtitles?.ffmpegCommand,
            },
            {
              name: "VIDEO_FILE",
              value: data.subtitles?.fileName,
            },
            {
              name: "VIDEO_LANGUAGE",
              value: data.subtitles?.videoLanguage,
            },
            {
              name: "TARGET_SUBTITLE_LANGUAGES",
              value: data.subtitles?.subtitleLangs,
            },
            {
              name: "SUBTITLE_UPLOAD_FOLDER_WITH_SLASH",
              value: data.subtitles?.subtitleUploadFolderWithShlash,
            },
            {
              name: "VIDEO_FILE_ONLY_NAME",
              value: data.subtitles?.fileName.slice(
                0,
                data.subtitles?.fileName.lastIndexOf(".")
              ),
            },
          ],
        },
      ],
      cpu: data.compute.cpu,
      memory: data.compute.memory,
    },
  });

  return runTaskCommand;
}
