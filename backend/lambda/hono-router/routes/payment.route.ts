import { genericErrorResponse } from "@/lib/app/hono-boilerplate/generic-error-response";
import { createRoute, z } from "@hono/zod-openapi";
import { authMiddleware } from "../middlewares/lucia.middleware";
import { SelectPaymentZodSchema } from "@/db/schema";

export const paymentRoute = createRoute({
  method: "post",
  middleware: [authMiddleware],
  path: "/payment",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            planId: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    500: genericErrorResponse("Payment successful"),
    400: genericErrorResponse("Plan id not found"),
    200: {
      description: "Payment successful",
      content: {
        "application/json": {
          schema: z.object({
            pgOrderId: z.string(),
            internalOrderId: z.string(),
          }),
        },
      },
    },
  },
});

export type TPaymentRoute = typeof paymentRoute;

export const razorpayWeebhookRoute = createRoute({
  method: "post",
  path: "/razorpay",
  request: {
    body: {
      description: "Razorpay webhook",
      content: {
        "application/json": {
          schema: z.any(),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Payment successful",
    },
    400: {
      description: "Payment failed",
    },
    500: {
      description: "Internal server error",
    },
  },
});

export type TRazorpayWeebhookRoute = typeof razorpayWeebhookRoute;

export const paymentInformationRoute = createRoute({
  method: "get",
  middleware: [authMiddleware],
  path: "payment/:id",
  responses: {
    400: genericErrorResponse("User not found"),
    500: genericErrorResponse("Payment information not found"),
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: SelectPaymentZodSchema,
        },
      },
    },
  },
});

export type TPaymentInformationRoute = typeof paymentInformationRoute;