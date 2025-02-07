import { initialiseDB } from "@/db";
import { operationsTable, SelectOperations } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function getOperationsByUserId({
  status,
  userId,
}: {
  userId: string;
  status?: SelectOperations["status"];
}): Promise<SelectOperations[]> {
  const db = await initialiseDB();

  if (status) {
    return await db
      .select()
      .from(operationsTable)
      .where(
        and(
          eq(operationsTable.userId, userId),
          eq(operationsTable.status, status)
        )
      );
  }

  return await db
    .select()
    .from(operationsTable)
    .where(eq(operationsTable.userId, userId));
}

export async function getOperationsByUploadTableId(uploadTableId: string) {
  const db = await initialiseDB();

  return await db
    .select()
    .from(operationsTable)
    .where(eq(operationsTable.uploadTableId, uploadTableId));
}
