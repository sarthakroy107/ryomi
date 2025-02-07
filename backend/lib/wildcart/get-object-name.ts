export function objectNameFromS3Key(s3Key: string) {
  return s3Key.split("/").pop();
}