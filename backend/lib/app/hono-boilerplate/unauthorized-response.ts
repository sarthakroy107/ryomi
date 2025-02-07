import { z } from "zod";

export const unAuthorizedResponse = {
  description: "Unauthorized",
  content: {
    "application/json": {
      schema: z.object({
        message: z.string().nullable(),
      }),
    },
  },
};
