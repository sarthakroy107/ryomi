import { genericErrorResponse } from "@/lib/app/hono-boilerplate/generic-error-response";
import { createRoute, z } from "@hono/zod-openapi";
import { authMiddleware } from "../middlewares/lucia.middleware";

export const downlaodRoute = createRoute({
  method: "post",
  path: "/download",
  middleware: [authMiddleware],
  request: {
    body: {
      description: "The body of the request",
      content: {
        "application/json": {
          schema: z.array(z.string()),
        },
      },
    },
  },

  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: z.array(
            z.object({
              url: z.string(),
              name: z.string(),
            })
          ),
        },
      },
    },

    401: genericErrorResponse("Unauthorized"),
    500: genericErrorResponse("Internal Server Error"),
    404: genericErrorResponse("File not found"),
    400: genericErrorResponse("Bad Request"),
  },
});

export type TDownloadFileRoute = typeof downlaodRoute;

export const deleteFileRoute = createRoute({
  middleware: [authMiddleware],
  method: "delete",
  path: "/file",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.array(z.string()),
        },
      },
    },
  },
  responses: {
    200: genericErrorResponse("File deleted successfully"),
    400: genericErrorResponse("No file ids found"),
    401: genericErrorResponse("Unauthorized to delete file"),
    404: genericErrorResponse("File not found"),
    500: genericErrorResponse("Internal Server Error"),
  },
});

export type TDeleteFileRoute = typeof deleteFileRoute;
