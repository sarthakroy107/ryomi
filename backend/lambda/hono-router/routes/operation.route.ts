import { genericErrorResponse } from "@/lib/app/hono-boilerplate/generic-error-response";
import { operationsSchema } from "@/lib/zod/operation-validator";
import { createRoute, z } from "@hono/zod-openapi";
import { authMiddleware } from "../middlewares/lucia.middleware";

export const operationRoute = createRoute({
  path: "/operation",
  method: "post",
  middleware: [authMiddleware],
  request: {
    body: {
      description: "The operation to be performed on the file",
      content: {
        "application/json": {
          schema: operationsSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "The operation was successful",
      content: {
        "application/json": {
          schema: z.object({
            transcode: z.object({
              success: z.boolean(),
              message: z.string(),
            }),
            subtitle: z.object({
              success: z.boolean(),
              message: z.string(),
            }),
            convert: z.object({
              success: z.boolean(),
              message: z.string(),
            }),
          }),
        },
      },
    },
    400: genericErrorResponse("Invalid request/ Invalid request body"),
    500: genericErrorResponse("Internal server error"),
  },
});

export type TOperationRoute = typeof operationRoute;
