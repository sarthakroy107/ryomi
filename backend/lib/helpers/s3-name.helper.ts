export function objectNameWithTimestamp(s3Key: string) {
  return s3Key.split("/").slice(1).join("/");
}