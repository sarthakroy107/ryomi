import { initialiseDB, TDB } from "@/db";
import { creditTransactionTable, operationsTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function queryOperationsWithCredits({
  rowCount,
  offset,
  userId,
  db,
}: {
  rowCount: number;
  offset: number;
  userId: string;
  db?: TDB;
}) {
  if (!db) db = await initialiseDB();

  return await db
    .select()
    .from(operationsTable)
    .innerJoin(
      creditTransactionTable,
      eq(operationsTable.id, creditTransactionTable.operationReferenceId)
    )
    .where(eq(operationsTable.userId, userId))
    .orderBy(desc(operationsTable.createdAt))
    .limit(rowCount)
    .offset(offset);
}
