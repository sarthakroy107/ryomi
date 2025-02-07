import { string } from "zod";
import { initialiseDB } from "../../db";
import { userFileTable } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function verifyUpload({
  uploadTableId,
}: {
  uploadTableId: string;
}) {
  const db = await initialiseDB();
  const uploadeeFile = await db
    .select()
    .from(userFileTable)
    .where(eq(userFileTable.id, uploadTableId));

  if (uploadeeFile.length === 0) {
    throw new Error("Uploaded file not found");
  }

  return uploadeeFile[0];
}
