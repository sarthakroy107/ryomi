import { initialiseDB, TDB } from "@/db";
import {
  userCreditTable,
  creditTransactionTable,
  operationsTable,
  SelectOperations,
} from "@/db/schema";
import { ulid } from "ulidx";
import { dateUTC } from "../app/date";
import { eq } from "drizzle-orm";

export async function insertFileOperationAndDeductCredit({
  dbInstance,
  data,
  creditsUsed,
}: {
  dbInstance?: TDB;
  data: Omit<
    SelectOperations,
    "id" | "createdAt" | "saveTill" | "size" | "creditTransactionId"
  >;
  creditsUsed: number;
}) {
  let db: TDB;

  if (dbInstance) db = dbInstance;
  else db = await initialiseDB();

  const transaction = await db
    .insert(creditTransactionTable)
    .values({
      creditAmount: creditsUsed,
      category: "transcode",
      id: ulid(),
      operationType: "debit",
      time: dateUTC,
      userId: data.userId,
      uploadReferenceId: data.uploadTableId,
    })
    .returning();

  const res = await db
    .insert(operationsTable)
    .values({
      id: ulid(),
      createdAt: dateUTC,
      saveTill: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      s3_key: data.s3_key,
      type: data.type,
      status: data.status,
      uploadTableId: data.uploadTableId,
      userId: data.userId,
    })
    .returning();

  return res[0].id;
}

export async function updateOperationStatusWithS3Key(
  s3Key: string,
  status: SelectOperations["status"],
  size?: number
) {
  const db = await initialiseDB();

  const res = await db
    .update(operationsTable)
    .set({
      status,
      size,
    })
    .where(eq(operationsTable.s3_key, s3Key))
    .returning();

  return res[0];
}
