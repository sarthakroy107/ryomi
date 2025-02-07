import { initialiseDB, TDB } from "@/db";
import { creditTransactionTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getCreditHistory({
  db,
  userId,
}: {
  userId: string;
  db?: TDB;
}) {
  if (!db) db = await initialiseDB();
  return await db
    .select()
    .from(creditTransactionTable)
    .where(eq(creditTransactionTable.userId, userId));
}
