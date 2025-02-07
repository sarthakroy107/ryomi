import { initialiseDB, TDB } from "@/db";
import { paymentTable, SelectPGTransactions } from "@/db/schema";
import { ULID, ulid } from "ulidx";

export async function insertPayment({
  id,
  db,
  userId,
  amount,
  status,
  pgRefId,
}: {
  db?: TDB;
  id: ULID;
  userId: string;
  amount: number;
  status: "success" | "failed" | "pending";
  pgRefId: string;
}): Promise<SelectPGTransactions> {
  if (!db) db = await initialiseDB();

  const data = await db
    .insert(paymentTable)
    .values({
      userId,
      amount,
      status,
      currency: "inr",
      type: "credit",
      createdAt: new Date(),
      updatedAt: new Date(),
      id,
      pgRefId: pgRefId,
    })
    .returning();

  return data[0];
}
