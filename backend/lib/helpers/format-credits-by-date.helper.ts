import { SelectCreditsHistory } from "@/db/schema";

type TReturn = {
  date: string;
  used: number;
};

export function creditsUsedEachDay({
  data,
  startDate,
  endDate,
}: {
  data: SelectCreditsHistory[];
  startDate: Date;
  endDate: Date;
}): TReturn[] {
  const grouped = data.reduce((acc, item) => {
    const date = item.time.toISOString().split("T")[0];
    if (!acc[date]) acc[date] = 0;
    acc[date] += item.creditAmount;
    return acc;
  }, {} as Record<string, number>);

  // Generate all dates between startDate and endDate
  const result: TReturn[] = [];
  for (
    let currentDate = new Date(startDate);
    currentDate <= endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    const dateStr = currentDate.toISOString().split("T")[0];
    result.push({
      date: dateStr,
      used: grouped[dateStr] || 0, // Use 0 if no purchase happened on this date
    });
  }

  return result;
}
