import { initialiseDB } from "@/db";
import { SelectUpload, userFileTable } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export async function countUploadedFiles(userId: string): Promise<number> {
  const db = await initialiseDB();
  const result = await db
    .select()
    .from(userFileTable)
    .where(eq(userFileTable.userId, userId));

  return result.length;
}

export async function getUploadedObjects(userId: string) {
  const db = await initialiseDB();
  const result = await db
    .select()
    .from(userFileTable)
    .where(eq(userFileTable.userId, userId));

  return result;
}

export async function getObjectByIdHelper(uploadTableId: string): Promise<SelectUpload> {
  const db = await initialiseDB();

  const file = await db
    .select()
    .from(userFileTable)
    .where(eq(userFileTable.id, uploadTableId));

  if (!file || !file[0])
    throw new Error(`File with id: ${uploadTableId} is not found`);

  return file[0];
}
