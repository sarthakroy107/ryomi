import { initialiseDB } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateProfile({
  displayPic,

  name,
  phoneNum,
  userId,
}: {
  userId: string;
  name: string;
  phoneNum: string | null;
  displayPic: string | null;
}) {
  const db = await initialiseDB();

  return await db
    .update(userTable)
    .set({
      name,
      phoneNum,
      displayPic,
    })
    .where(eq(userTable.id, userId))
    .returning();
}
