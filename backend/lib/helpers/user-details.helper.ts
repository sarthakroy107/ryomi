import { initialiseDB, TDB } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getUserByIdHelper = async (userId: string, db?: TDB) => {

  if (!db) {
    db = await initialiseDB();
  }

  return await db.select().from(userTable).where(eq(userTable.id, userId));
};
