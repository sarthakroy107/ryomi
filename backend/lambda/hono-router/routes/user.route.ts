import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "@/lib/app/http-statuses/http-status-codes";
import { genericErrorResponse } from "@/lib/app/hono-boilerplate/generic-error-response";
import { authMiddleware } from "../middlewares/lucia.middleware";
import { SelectUserZodSchema } from "@/db/schema";

const resposeSchema = z.object({
  message: z.string(),
});

export const userDetails = createRoute({
  path: "/user-token",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: {
      description: "Get user details from auth token",
      content: {
        "application/json": {
          schema: resposeSchema,
        },
      },
    },
  },
});

export const dashboardRoute = createRoute({
  path: "/dashboard",
  middleware: [authMiddleware],
  method: "get",
  responses: {
    401: genericErrorResponse("Unauthorized"),
    500: genericErrorResponse("Internal server error"),
    200: {
      description:
        "Get summarised view of user data such as total uploaded files, operations performing, file deletions in next 3 days",
      content: {
        "application/json": {
          schema: z.object({
            user: z.object({
              name: z.string(),
              email: z.string(),
              dp: z.string().nullable(),
              id: z.string(),
            }),
            credits: z.number(),
            uploadedFiles: z.number(),
            ongoingTasks: z.number(),
            nextDeletions: z.number(),
          }),
        },
      },
    },
  },
});

export type TDashboardRoute = typeof dashboardRoute;

export const userProfileRRoute = createRoute({
  method: "get",
  path: "/user-profile",
  middleware: [authMiddleware],
  responses: {
    401: genericErrorResponse("Unauthorized"),
    404: genericErrorResponse("User details not found in DB"),
    500: genericErrorResponse("Internal server error"),
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: SelectUserZodSchema,
        },
      },
    },
  },
});

export type TUserProfileRoute = typeof userProfileRRoute;
