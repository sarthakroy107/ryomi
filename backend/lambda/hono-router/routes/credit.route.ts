import { genericErrorResponse } from "@/lib/app/hono-boilerplate/generic-error-response";
import { createRoute, z } from "@hono/zod-openapi";
import { authMiddleware } from "../middlewares/lucia.middleware";
import { operationsSchema } from "@/lib/zod/operation-validator";

export const GETCreditHistory = createRoute({
  path: "/credits/usage",
  middleware: [authMiddleware],
  method: "get",
  responses: {
    500: genericErrorResponse("Internal server error"),
    401: genericErrorResponse("Unauthorized"), //! Don't chnage the order of response. It'll cause type errror
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: z.object({
            currentAmount: z.number(),
            recentUsage: z.object({
              creditsUsed: z.number(),
              dates: z.object({
                start: z.string(),
                end: z.string(),
              }),
              usage: z.array(
                z.object({
                  date: z.string(),
                  used: z.number(),
                })
              ),
              // categoryPercentage: z.array(
              //   z.object({
              //     category: z.string(),
              //     percentage: z.number(),
              //   })
              // ),
            }),
          }),
          // schema: z.any(),
        },
      },
    },
  },
});

export type TCreditHistoryGETRoute = typeof GETCreditHistory;

export const POSTCreditCalculatorRoute = createRoute({
  path: "/credit/calculator",
  method: "post",
  middleware: [authMiddleware],
  request: {
    body: {
      content: {
        "application/json": {
          schema: operationsSchema,
        },
      },
    },
  },

  responses: {
    401: genericErrorResponse("Invalid request/ Invalid request body"),
    500: genericErrorResponse("Internal server error"),
    200: {
      description: "The operation was successful",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string().nullable(),
            creditsNeeded: z.number(),
          }),
        },
      },
    },
  },
});

export type TCalculateCreditRoute = typeof POSTCreditCalculatorRoute;
