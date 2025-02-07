import { z } from "zod";

export const internalServerErrorResponse = {
  description: "Internal server error",
  content: {
    "application/json": {
      schema: z.object({
        message: z.string().nullable(),
      }),
    },
  },
};
