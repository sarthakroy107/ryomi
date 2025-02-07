import { Context } from "hono";
import { verifyUpload } from "@/lib/queries/verify-upload";
import { pushMessageToSQS } from "@/lib/aws/push-sqs";
import { generateFFmpegCommand } from "@/lib/wildcart/shell";
import { operationsSchema } from "@/lib/zod/operation-validator";
import { SQSMessageBody } from "@/lib/zod/sqs-message-body";
import { objectNameFromS3Key } from "@/lib/wildcart/get-object-name";

export async function transcoderHandler(c: Context) {
  try {
    const body = await c.req.json();

    const user = c.get("user");

    if (!user || user.id === undefined) {
      return c.json({ message: `User not found: ${user}` }, 400);
    }

    const result = operationsSchema.safeParse(body);

    if (!result.success) {
      return c.json(
        {
          error: `Invalid body: ${result.error.errors
            .map((e) => `${e.path}->${e.message}`)
            .join(", ")}`,
        },
        400
      );
    }

    const { uploadTableId, convert, subtitling, transcode } = result.data;

    // Check if the file is uploaded
    const uploadeeFile = await verifyUpload({ uploadTableId });

    if (uploadeeFile.uploaded === false) {
      return c.json({ message: "File not uploaded yet" }, 400);
    }

    const sqsUrl = process.env.AWS_SQS_URL;

    if (!sqsUrl) {
      return c.json({ message: "SQS URL not found" }, 500);
    }

    //!Pending: Calculate the credits needed for the transcode
    // const actutalOperattions = operations.map((op) => scalingOptions[op]);

    // const neededCredits = creditsNeededForTranscode({
    //   operations: actutalOperattions,
    //   size: uploadeeFile.size,
    // });

    const ffmpegCommand = generateFFmpegCommand({
      s3_key: uploadeeFile.s3_key.replace("/uploads/", "/"),
      transcode,
    });

    const messageBody = {
      computeType: "moderate",
      s3FileDownloadCommand: `aws s3 cp s3://ryomi/${
        uploadeeFile.s3_key
      } ${objectNameFromS3Key(uploadeeFile.s3_key)}`,
      ffmpegCommand,
      uploadOutputObjectsCommand: `aws s3 cp /output s3://ryomi-output/${uploadeeFile.id} --recursive`,
    } satisfies SQSMessageBody;

    // return c.json({ message: ffmpegCommand }, 200);

    await pushMessageToSQS({
      sqsUrl,
      messageBody: JSON.stringify(messageBody),
      groupId: `${user.id}-${uploadTableId}-${new Date(
        Date.now()
      ).toISOString()}`,
      dedeuplicationId: `${user.id}-${uploadTableId}-${new Date(
        Date.now()
      ).toISOString()}`,
    });

    return c.json({ message: "Operation queued" });
  } catch (error) {
    console.error(error);
    return c.json({ message: error }, 500);
  }
}
