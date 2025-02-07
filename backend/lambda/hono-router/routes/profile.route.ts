import { SelectSUserZodSchema } from "@/db/schema";
import { genericErrorResponse } from "@/lib/app/hono-boilerplate/generic-error-response";
import { createRoute, z } from "@hono/zod-openapi";
import { authMiddleware } from "../middlewares/lucia.middleware";

export const GETProfileRoute = createRoute({
  path: "/profile",
  method: "get",
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: SelectSUserZodSchema.omit({
            password_hash: true,
            campaign: true,
            referred_by: true,
          }),
        },
      },
    },
    400: genericErrorResponse("Bad request"),
    401: genericErrorResponse("Unauthorized"),
    500: genericErrorResponse("Internal server error"),
  },
});

export type TProfileGETRoute = typeof GETProfileRoute;

export const PUTProfileRoute = createRoute({
  middleware: [authMiddleware],
  path: "/profile",
  method: "put",
  request: {
    body: {
      description: "Update user profile",
      content: {
        "application/json": {
          schema: SelectSUserZodSchema.pick({
            name: true,
            phoneNum: true,
            displayPic: true,
          }).default({
            name: "",
            phoneNum: null,
            displayPic: null,
          }),
        },
      },
    },
  },
  responses: {
    200: genericErrorResponse("OK"),
    400: genericErrorResponse("Bad request"),
    401: genericErrorResponse("Unauthorized"),
    500: genericErrorResponse("Internal server error"),
  },
});

export type TProfilePUTRoute = typeof PUTProfileRoute;

export const resetPasswordGeneratorRoute = createRoute({
  middleware: [authMiddleware],
  path: "/profile/reset-password",
  method: "post",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z
            .object({
              email: z.string(),
            }),
        },
      },
    },
  },
  responses: {
    200: genericErrorResponse("OK"),
    400: genericErrorResponse("Bad request"),
    401: genericErrorResponse("Unauthorized"),
    500: genericErrorResponse("Internal server error"),
  },
});

export type TResetPasswordGenerator = typeof resetPasswordGeneratorRoute;

export const resetPasswordRoute = createRoute({
  path: "/profile/reset-password",
  method: "put",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            password: z.string(),
            verificationCode: z.string(),
            userId: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: genericErrorResponse("OK"),
    400: genericErrorResponse("Bad request"),
    401: genericErrorResponse("Unauthorized"),
    500: genericErrorResponse("Internal server error"),
  },
});

export type TResetPassword = typeof resetPasswordRoute;
