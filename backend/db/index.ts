import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

let pool: Pool | null;

export async function initialiseDB(db_url?: string) {
  if (!process.env.DATABASE_URL && !db_url) {
    throw new Error(
      "DATABASE_URL not found in environment variables or passed as argument"
    );
  }

  if (!pool) {
    pool = new Pool({
      connectionString: db_url || process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  return drizzle(pool);
}

export type TDB = Awaited<ReturnType<typeof initialiseDB>>;