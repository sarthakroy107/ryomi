export function formatName({
  key,
  maxLength,
}: {
  key: string | undefined | null;
  maxLength: number;
}) {
  if (!key) return "";
  const completeName = key.split("/").pop();

  if (!completeName) return "";

  return completeName.length > maxLength
    ? `${completeName.slice(0, maxLength - 2)}...`
    : completeName;
}
