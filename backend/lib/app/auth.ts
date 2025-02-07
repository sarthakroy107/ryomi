// src/auth.ts

import { Pool } from "pg";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Lucia } from "lucia";
import * as schema from "../../db/schema";

let pool: Pool | null;

export function initialiseLucia(db_url?: string) {
  const { userTable, sessionTable } = schema;

  if (!pool) {
    pool = new Pool({
      connectionString: db_url ?? process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  const db: NodePgDatabase<typeof schema> = drizzle(pool);

  const adapter = new DrizzlePostgreSQLAdapter(
    db as any,
    sessionTable,
    userTable
  );

  return new Lucia(adapter, {
    sessionCookie: {
      expires: false,

      attributes: {
        secure: true,
        sameSite: "none",
      },
    },

    getUserAttributes: (attributes) => {
      return {
        email: attributes.email,
        id: attributes.id,
      };
    },
  });
}
declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof initialiseLucia>;
    DatabaseUserAttributes: schema.SelectUser;
  }
}
