import { initialiseDB, TDB } from "@/db";
import { creditTransactionTable, SelectCreditsHistory } from "@/db/schema";
import { and, between, eq, gte, lte, ne, sql } from "drizzle-orm";
import { queryOperationsWithCredits } from "../helpers/recent-operations.helper";

type TProps =
  | {
      userId: string;
      db?: TDB;
    }
  | {
      db: TDB;
      userId: string;
      startDate: Date;
      endDate: Date;
    };

export async function getCreditTransactions(
  props: TProps
): Promise<SelectCreditsHistory[]> {
  const userId = props.userId;
  let db = props.db;
  if (!db) db = await initialiseDB();

  if ("startDate" in props && "endDate" in props) {
    const { startDate, endDate } = props;
    const result = await db
      .select()
      .from(creditTransactionTable)
      .where(
        and(
          eq(creditTransactionTable.userId, userId),
          gte(creditTransactionTable.time, startDate),
          lte(creditTransactionTable.time, endDate),
          ne(creditTransactionTable.operationType, "credit")
        )
      );
    console.log(result);

    return result;
  }

  console.log("Check point 2");
  const result = await db
    .select()
    .from(creditTransactionTable)
    .where(and(eq(creditTransactionTable.userId, userId)));

  console.log(result);

  return result;
}

export async function getOperationsWithCreditsUsed({
  db,
  userId,
  rowsCount,
  offset,
}: {
  db?: TDB;
  userId: string;
  rowsCount: number;
  offset: number;
}) {
  if (!db) db = await initialiseDB();

  const data = await queryOperationsWithCredits({
    rowCount: rowsCount,
    offset,
    userId,
    db,
  });

  return data.map((row) => {
    return {
      id: row.operations.id,
      creditUsed: row.credit_transactions.creditAmount,
      type: row.operations.type,
    };
  });
}
