import { eq } from "drizzle-orm";
import { initialiseDB } from "@/db";
import { userCreditTable } from "@/db/schema";
import { calculateCreditBasedOnSize } from "@/lib/credit-calculation/storage";

export async function hasSufficientCredit({
  userId,
  size,
}: {
  userId: string;
  size: number;
}): Promise<boolean> {
  const db = await initialiseDB();

  const user = await db
    .select({
      creditAvailable: userCreditTable.amount,
    })
    .from(userCreditTable)
    .where(eq(userCreditTable.userId, userId));

  if (user.length === 0) {
    throw new Error("User credit table not found");
  }

  const userCredits = user[0].creditAvailable;

  return userCredits >= calculateCreditBasedOnSize(size);
}
