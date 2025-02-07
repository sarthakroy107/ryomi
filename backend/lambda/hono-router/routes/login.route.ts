import { genericErrorResponse } from "@/lib/app/hono-boilerplate/generic-error-response";
import { createRoute, z } from "@hono/zod-openapi";

export const loginRoute = createRoute({
  path: "/login",
  method: "post",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            email: z.string(),
            password: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    400: genericErrorResponse("Invalid request/ Invalid re body"),
    200: {
      description: "User logged in",
      content: {
        "application/json": {
          schema: z.object({
            userId: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    500: genericErrorResponse("Internal server error"),
  },
});

export type LoginRoute = typeof loginRoute;
