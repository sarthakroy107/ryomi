import { eq } from "drizzle-orm";
import { initialiseDB } from "../../db";
import { userCreditTable } from "../../db/schema";

export async function currentCredit(userid: string): Promise<number> {
  const db = await initialiseDB();
  
  const credit = await db
    .select({
      credit: userCreditTable.creditAmount,
    })
    .from(userCreditTable)
    .where(eq(userCreditTable.userId, userid));

  if (!credit || credit.length === 0) {
    throw new Error("Credit table not found")
  }

  return credit[0].credit;
}
