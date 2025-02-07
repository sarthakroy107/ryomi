import { initialiseDB, TDB } from "@/db";
import { userCreditTable } from "@/db/schema";
import { dateUTC } from "../app/date";
import { eq } from "drizzle-orm";

export async function deductCredit({
  db,
  deductionAmount,
  userId,
}: {
  db?: TDB;
  userId: string;
  deductionAmount: number;
}) {
  if (!db) db = await initialiseDB();

  await db.transaction(async (trx) => {
    const res = await trx
      .select()
      .from(userCreditTable)
      .where(eq(userCreditTable.userId, userId));
    if (!res[0]) {
      trx.rollback();
      throw new Error("User not found");
    }

    const userCredit = res[0].creditAmount;

    if (userCredit < deductionAmount) {
      trx.rollback();
      throw new Error("Not enough credit");
    }

    await trx
      .update(userCreditTable)
      .set({
        creditAmount: userCredit - deductionAmount,
        updated_at: dateUTC,
      })
      .where(eq(userCreditTable.userId, userId));
  });
}
