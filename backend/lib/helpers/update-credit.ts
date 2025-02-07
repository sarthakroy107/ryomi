import { initialiseDB, TDB } from "@/db";
import {
  userCreditTable,
  creditTransactionTable,
  paymentTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { ulid } from "ulidx";
import { dateUTC } from "../app/date";
import {
  checkPlan,
  findPlanWithAmount,
} from "../credit-calculation/check-plan";

export async function updateCredit({
  db,
  paymentRefId,
}: {
  db?: TDB;
  paymentRefId: string;
}): Promise<void> {
  if (!db) db = await initialiseDB();

  console.log(`Updating credit for the payment reference id: ${paymentRefId}`);
  const payments = await db
    .select()
    .from(paymentTable)
    .where(eq(paymentTable.id, paymentRefId));

  if (payments.length === 0)
    throw new Error(
      `Payment not found with the razorpay order_id: ${paymentRefId}`
    );

  const payment = payments[0];

  console.log(
    `Checking if credit already added for the payment reference id: ${payment.id}`
  );
  const creditTransactions = await db
    .select()
    .from(creditTransactionTable)
    .where(eq(creditTransactionTable.paymentReferenceId, payment.id));

  if (creditTransactions.length > 0)
    throw new Error(
      `Credit already added for the payment table reference id: ${payment.id}`
    );
  const plan = findPlanWithAmount(payment.amount);
  console.log(`Adding credit for the payment reference id: ${payment.id}`);
  await db.transaction(async (trx) => {
    await trx.insert(creditTransactionTable).values({
      creditAmount: plan.credits,
      userId: payment.userId,
      paymentReferenceId: payment.id,
      category: "credits_purchase",
      id: ulid(),
      operationType:"credit",
      time: dateUTC,
      operationReferenceId: null,
      uploadReferenceId: null,
    });
    console.log(`Credit added for the payment reference id: ${payment.id}`);
    const userCredits = await trx
      .select()
      .from(userCreditTable)
      .where(eq(userCreditTable.userId, payment.userId));
    console.log(`Updating user credits for the user: ${payment.userId}`);
    if (userCredits.length === 0) {
      trx.rollback();
      throw new Error(`User credits not found for the user: ${payment.userId}`);
    }
    console.log(`User credits found for the user: ${payment.userId}`);
    await trx
      .update(userCreditTable)
      .set({
        creditAmount: userCredits[0].creditAmount + plan.credits,
        updated_at: dateUTC,
        
      })
      .where(eq(userCreditTable.userId, payment.userId));
  });

  console.log(`Credit updated for the payment reference id: ${payment.id}`);
}
