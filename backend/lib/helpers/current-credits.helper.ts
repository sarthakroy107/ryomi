import { eq } from "drizzle-orm";
import { initialiseDB, TDB } from "@/db";
import { userCreditTable } from "@/db/schema";

export async function currentCredit({
  db,
  userid,
}: {
  userid: string;
  db?: TDB;
}): Promise<number> {
  if (!db) db = await initialiseDB();
  const credit = await db
    .select({
      credit: userCreditTable.creditAmount,
    })
    .from(userCreditTable)
    .where(eq(userCreditTable.userId, userid));

  if (!credit || credit.length === 0) {
    throw new Error("Credit taable not found");
  }

  return credit[0].credit;
}
