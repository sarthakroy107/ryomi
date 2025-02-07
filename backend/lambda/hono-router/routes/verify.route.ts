import { genericErrorResponse } from "@/lib/app/hono-boilerplate/generic-error-response";
import { createRoute, z } from "@hono/zod-openapi";

const resposeSchema = z.object({
  message: z.string(),
});

export const verifyEmailRoute = createRoute({
  method: "get",
  path: "/verify-email",
  responses: {
    200: {
      description: "Verify email address",
      content: {
        "application/json": {
          schema: resposeSchema,
        },
      },
    },

    400: genericErrorResponse("Bad request"),
    500: genericErrorResponse("Internal server error"),
  },
});

export type TVerifyEmailRoute = typeof verifyEmailRoute;
