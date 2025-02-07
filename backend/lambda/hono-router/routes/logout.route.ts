import { createRoute } from "@hono/zod-openapi";
import { authMiddleware } from "../middlewares/lucia.middleware";
import { genericErrorResponse } from "@/lib/app/hono-boilerplate/generic-error-response";

export const logoutRoute = createRoute({
  method: "post",
  path: "/logout",
  middleware: [authMiddleware],
  responses: {
    200: genericErrorResponse("Logout successful"),
    401: genericErrorResponse("Unauthorized"),
    500: genericErrorResponse("Internal server error"),
  },
});

export type TLogoutRoute = typeof logoutRoute;