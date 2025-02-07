import { initialiseDB, TDB } from "@/db";
import { TUserZodSchema, userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function fetchUserDetailsByEmail(
  email: string,
  db?: TDB
): Promise<TUserZodSchema> {
  if (!db) db = await initialiseDB();

  const res = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  return res[0];
}
