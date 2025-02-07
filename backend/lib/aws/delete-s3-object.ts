import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

export async function deleteS3Object({
  bucketName,
  key,
}: {
  bucketName: string;
  key: string;
}) {
  const s3Client = new S3Client({ region: process.env.AWS_REGION });
  try {
    await s3Client.send(
      new DeleteObjectCommand({ Bucket: bucketName, Key: key })
    );
  } catch (e) {
    console.error(
      `Error deleting objectKey: ${key} in bucket: ${bucketName} from s3.`,
      e
    );
    throw e;
  }
}
