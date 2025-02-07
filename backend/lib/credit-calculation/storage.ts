export function calculateCreditBasedOnSize(size: number): number {
  const sizeInGBFloor = Math.floor(size / 1024 / 1024 / 1024);

  let neededCredits;

  if (sizeInGBFloor * 1024 * 1024 * 1024 + 100 * 1024 * 1024 > size) {
    neededCredits = sizeInGBFloor + 1;
  } else neededCredits = sizeInGBFloor;

  return neededCredits;
}