import { genericErrorResponse } from "@/lib/app/hono-boilerplate/generic-error-response";
import { createRoute, z } from "@hono/zod-openapi";

export const registerRoute = createRoute({
  path: "/register",
  method: "post",
  request: {
    body: {
      required: true,
      description: "User registration details",
      content: {
        "application/json": {
          schema: z.object({
            name: z.string(),
            email: z.string(),
            password: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Unauthorized: User not found",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    500: genericErrorResponse("Internal server error"),

    400: genericErrorResponse("Invalid request/ Invalid request body"),

    409: genericErrorResponse("Email already in use"),


  },
});

export type TRegisterRoute = typeof registerRoute;
