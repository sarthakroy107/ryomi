export function s3KeyNameFormatter(
  s3Key: string | undefined | null,
  maxLength?: number
) {
  if (!s3Key) {
    return "";
  }
  const fullName = s3Key
    .split("/")
    .filter((item, i) => i >= 1)
    .join("/")
    .split("-")
    .filter((item, i) => i > 2)
    .join("-");

  if (maxLength && fullName.length > maxLength - 2) {
    return fullName.slice(0, maxLength) + "...";
  }

  return fullName;
}
