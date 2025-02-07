export function creditsNeededForTranscode({
  operations,
  size,
}: {
  operations: string[];
  size: number;
}): number {
  let sizeInGBFloor = Math.floor(size / 1024 / 1024 / 1024);
  if (sizeInGBFloor < 1) sizeInGBFloor = 1;

  let neededcredits = 0;

  operations.forEach((operations) => {
    switch (operations) {
      case "256:144":
        neededcredits += 1;
        break;
      case "426:240":
        neededcredits += 1;
        break;
      case "640:360":
        neededcredits += 1;
        break;
      case "854:480":
        neededcredits += 2;
        break;
      case "1280:720":
        neededcredits += 2;
        break;
      case "1920:1080":
        neededcredits += 3;
        break;
      case "2560:1440":
        neededcredits += 4;
        break;
      case "3840:2160":
        neededcredits += 4;
        break;
      case "7680:4320":
        neededcredits += 5;
        break;
      default:
        neededcredits += 0;
    }
  });

  return neededcredits * sizeInGBFloor;
}
