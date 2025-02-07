import { initialiseDB, TDB } from "@/db";
import { paymentTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function checkPaymentStatus({
  db,
  orderId,
}: {
  db?: TDB;
  orderId: string;
}) {
  if (!db) db = await initialiseDB();

  const payments = await db
    .select()
    .from(paymentTable)
    .where(eq(paymentTable.pgRefId, orderId));

  return payments[0];
}
