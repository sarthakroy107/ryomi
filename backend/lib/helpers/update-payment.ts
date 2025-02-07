import { initialiseDB, TDB } from "@/db";
import { paymentTable, SelectPGTransactions } from "@/db/schema";
import { dateUTC } from "../app/date";
import { eq } from "drizzle-orm";

export async function updatePaymentStatus({
  db,
  paymntStatus,
  referenceId,
  method,
  json,
}: {
  db?: TDB;
  referenceId: string;
  paymntStatus: SelectPGTransactions["status"];
  method: string;
  json: any;
}): Promise<SelectPGTransactions> {
  if (!db) db = await initialiseDB();

  const updatedData = await db
    .update(paymentTable)
    .set({
      updatedAt: dateUTC,
      status: paymntStatus,
      method,
      webhookJson: json,
    })
    .where(eq(paymentTable.pgRefId, referenceId))
    .returning();

  return updatedData[0];
}
