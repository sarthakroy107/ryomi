import { eq } from "drizzle-orm";
import { initialiseDB } from "../../db";
import { userCreditTable, userFileTable } from "../../db/schema";
import { calculateCreditBasedOnSize } from "../credit-calculation/storage";

export async function updateUploadTableData({
  id,
  status,
  userId,
}: {
  id: string;
  status: boolean;
  userId: string;
}) {
  const db = await initialiseDB();

  const updateData = await db
    .update(userFileTable)
    .set({
      uploaded: status,
    })
    .where(eq(userFileTable.id, id))
    .returning();

  if (updateData.length === 0) {
    throw new Error("Instance not found");
  }

  if (updateData[0].userId !== userId) {
    throw new Error("Unauthorized: Instance does not belong to user");
  }

  const creditUsed = calculateCreditBasedOnSize(updateData[0].size);

  await db.transaction(async (tsx) => {
    const creditAvailable = await tsx
      .select()
      .from(userCreditTable)
      .where(eq(userCreditTable.userId, updateData[0].userId));

    await tsx.update(userCreditTable).set({
      creditAmount: creditAvailable[0].creditAmount - creditUsed,
    });
  });
}
