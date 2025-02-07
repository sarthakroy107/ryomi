import { z } from "zod";

export const genericErrorResponse = (description: string) => {
  return {
    description,
    content: {
      "application/json": {
        schema: z.object({
          message: z.string().nullable(),
        }),
      },
    },
  };
};
