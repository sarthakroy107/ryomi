"use client";

import { z } from "zod";
const envSchema = z.object({
  NEXT_PUBLIC_BACKEND_URL: z.string(),
});
const env = envSchema.parse({
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export { env };
