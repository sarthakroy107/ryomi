import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getS3SignedGetUrl(
  key: string,
  bucket: string,
  expiry: number
): Promise<string> {
  const client = new S3Client({ region: "ap-south-1" });

  const command = new GetObjectCommand({ Bucket: bucket, Key: key });

  return getSignedUrl(client, command, { expiresIn: expiry });
}
