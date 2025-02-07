import { initialiseDB } from "@/db";
import { operationsTable, userFileTable } from "@/db/schema";
import { eq, sql, and, gte } from "drizzle-orm";

export async function CountUpcomingDeletions({
  userId,
  days,
}: {
  userId: string;
  days: number;
}): Promise<number> {
  const db = await initialiseDB();

  // Fetch the count from the first table
  const rows1: any = await db
    .select()
    .from(operationsTable)
    .where(
      and(
        eq(operationsTable.userId, userId),
        gte(
          operationsTable.saveTill,
          new Date(Date.now() + days * 24 * 60 * 60 * 1000)
        )
      )
    );

  // Fetch the count from the second table
  const rows2: any = await db
    .select()
    .from(userFileTable)
    .where(
      and(
        eq(userFileTable.userId, userId),
        gte(
          userFileTable.saveTill,
          new Date(Date.now() + days * 24 * 60 * 60 * 1000)
        )
      )
    );

  // Extract counts from the query result
  const count1 = rows1[0]?.count || 0;
  const count2 = rows2[0]?.count || 0;

  // Return the sum of the two counts
  return count1 + count2;
}

// export async function CountUpcomingDeletions({
//   userId,
//   days,
// }: {
//   userId: string;
//   days: number;
// }): Promise<number> {
//   const db = await initialiseDB();

//   // Fetch the count from the first table
//   const rows1: any = await db.execute(
//     sql`SELECT COUNT(*) as count
//         FROM ${operationsTable}
//         WHERE ${operationsTable.userId} = ${userId}
//         AND DATE(${
//           operationsTable.saveTill
//         }) = (CURRENT_DATE + INTERVAL '${days} DAYS')`
//   );

//   // Fetch the count from the second table
//   const rows2: any = await db.execute(
//     sql`SELECT COUNT(*) as count
//         FROM ${userUpdloadTable}
//         WHERE ${userUpdloadTable.userId} = ${userId}
//         AND DATE(${
//           userUpdloadTable.save_till
//         }) = (CURRENT_DATE + INTERVAL '${days} DAYS')`
//   );

//   // Extract counts from the query result
//   const count1 = rows1[0]?.count || 0; // Safely extract count
//   const count2 = rows2[0]?.count || 0; // Safely extract count

//   // Return the sum of the two counts
//   return count1 + count2;
// }
