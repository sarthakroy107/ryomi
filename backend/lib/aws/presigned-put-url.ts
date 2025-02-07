import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { initialiseDB } from "../../db";
import { userFileTable } from "../../db/schema";
import { ulid } from "ulidx";

const s3Client = new S3Client({
  region: "ap-south-1",
});

export async function getS3SignedPutUrl({
  objKey,
}: {
  objKey: string;
}) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: objKey,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3 * 3600 });
}

export async function inserttUserUplaodKey({
  userId,
  s3Key,
  size,
  fileName
}: {
  userId: string;
  s3Key: string;
  size: number;
  uploadStatus: boolean;
  fileName: string;
}) {
  const db = await initialiseDB();

  const uploadData = await db
    .insert(userFileTable)
    .values({
      id: ulid(),
      createdAt: new Date(Date.now()),
      fileName,
      s3Key: s3Key,
      saveTill: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      size,
      userId,
      status: "uploaded",
    })
    .returning();

  return uploadData[0].id;
}
