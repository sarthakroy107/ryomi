export function formatBytes(bytes: number): string {
  const GB = 1024 * 1024 * 1024;
  const MB = 1024 * 1024;

  if (bytes >= GB) {
    const gb = bytes / GB;
    return `${gb.toFixed(2)} GB`;
  } else {
    const mb = bytes / MB;
    return `${mb.toFixed(2)} MB`;
  }
}