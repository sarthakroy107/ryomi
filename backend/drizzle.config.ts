import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { honoEnv } from "./lambda/hono-router/env";

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  casing: "snake_case",
  verbose: true,
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Don't use zod
    ssl: true,
  },
});
