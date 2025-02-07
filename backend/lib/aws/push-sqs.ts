import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import {
  SQSMessageBody,
  SQSMessageBodySchema,
} from "@/lib/zod/sqs-message-body";

const sqsClient = new SQSClient({ region: "ap-south-1" });

export async function pushMessageToSQS({
  sqsUrl,
  messageBody,
  dedeuplicationId,
  groupId,
}: {
  sqsUrl: string;
  messageBody: SQSMessageBody;
  groupId: string;
  dedeuplicationId: string;
}) {
  console.log("Pushing message to SQS: Before zod validation");
  const data = SQSMessageBodySchema.parse(messageBody);
  console.log("Pushing message to SQS: After zod validation");

  try {
    await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: sqsUrl,
        MessageBody: JSON.stringify(data),
        MessageDeduplicationId: dedeuplicationId,
        MessageGroupId: groupId,
      })
    );
    console.log("Message pushed to SQS");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to push message to SQS");
  }
}
