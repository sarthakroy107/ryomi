import { S3Event } from "aws-lambda";
import { inserttUserUplaodKey } from "@/lib/aws/presigned-put-url";

export async function handler(event: S3Event) {
  try {
    const s3Bucket = event.Records[0].s3.bucket.name;
    const s3ObjectKey = decodeURIComponent(event.Records[0].s3.object.key);
    const fileSize = event.Records[0].s3.object.size;

    if (!s3Bucket || !s3ObjectKey) {
      throw new Error(
        `Invalid S3 event-> Bucket name:${event.Records[0].s3.bucket.name}, Bucket key:${event.Records[0].s3.object.key}`
      );
    }

    const [userId, fileName] = s3ObjectKey.split("/");

    await inserttUserUplaodKey({
      s3Key: s3ObjectKey,
      userId: userId,
      size: fileSize,
      uploadStatus: true,
      fileName,
    });
  } catch (error) {
    console.error(error);
  }
}
