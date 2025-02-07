import { updateOperationStatusWithS3Key } from "@/lib/helpers/operation-table.helper";
import { S3Event } from "aws-lambda";

export async function handler(event: S3Event) {
  const size = event.Records[0].s3.object.size;
  const s3ObjectKey = decodeURIComponent(event.Records[0].s3.object.key);

  try {
    if (!s3ObjectKey) {
      throw new Error("No key found in event");
    }
    console.log(`Received event for key: ${s3ObjectKey} with size: ${size}`);

    if (!process.env.DATABASE_URL)
      throw new Error("DATABASE_URL not found in environment variables");

    const newData = await updateOperationStatusWithS3Key(
      s3ObjectKey,
      "complete",
      size
    );

    console.log(
      `Updated operation with id: ${newData.id}, status: ${newData.status}`
    );
  } catch (error) {
    console.error(error);
  }
}
