import { genericErrorResponse } from "@/lib/app/hono-boilerplate/generic-error-response";
import { createRoute, z } from "@hono/zod-openapi";
import { authMiddleware } from "../middlewares/lucia.middleware";
import { SelectOperationsZodSchema, SelectUploadZodSchema } from "@/db/schema";

export const objectUploadPOSTRoute = createRoute({
  path: "/upload",
  method: "post",
  middleware: [authMiddleware],
  request: {
    body: {
      description: "Upload object",
      content: {
        "application/json": {
          schema: z.object({
            fileName: z.string(),
            fileSize: z.coerce.number(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Upload object",
      content: {
        "application/json": {
          schema: z.object({
            uploadURL: z.string(),
          }),
        },
      },
    },
    400: genericErrorResponse("Invalid request/ Invalid request body"),
    500: genericErrorResponse("Internal server error"),
    401: genericErrorResponse("Unauthorized"),
  },
});

export type TObjectUploadPOSTRoute = typeof objectUploadPOSTRoute;

export const objectUploadPUTRoute = createRoute({
  path: "/upload",
  method: "put",
  middleware: [authMiddleware],
  request: {
    body: {
      description: "Confirm file upload",
      content: {
        "application/json": {
          schema: z.object({
            uploadTableId: z.string(),
            uploadCompleted: z.boolean(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "File uploaded successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    401: genericErrorResponse("Unauthorized"),
    500: genericErrorResponse("Internal server error"),
  },
});

export type TObjectUploadPUTRoute = typeof objectUploadPUTRoute;

export const objectUploadGETRoute = createRoute({
  path: "/upload",
  method: "get",
  middleware: [authMiddleware],
  responses: {
    200: {
      description: "Get uploaded video files",
      content: {
        "application/json": {
          schema: z.array(SelectUploadZodSchema),
        },
      },
    },
    401: genericErrorResponse("Unauthorized"),
    500: genericErrorResponse("Internal server error"),
  },
});

export type TObjectUploadGETRoute = typeof objectUploadGETRoute;

export const GETObjectWithIdRoute = createRoute({
  path: "/upload/:id",
  method: "get",
  middleware: [authMiddleware],
  responses: {
    400: genericErrorResponse("Bad request"),
    500: genericErrorResponse("Internal server error"),
    200: {
      description:
        "Get uplaoded object informations with derived objects(trasncode, convert, subtitles)",
      content: {
        "application/json": {
          schema: z.object({
            file: SelectUploadZodSchema,
            transcodes: z.array(
              SelectOperationsZodSchema.refine((v) => v.type === "transcode", {
                message: "Invalid type, only transcodes are allowed",
              })
            ),
            conversions: z.array(
              SelectOperationsZodSchema.refine((v) => v.type === "conversion", {
                message: "Invalid type, only conversions are allowed",
              })
            ),
            subtitles: z.array(
              SelectOperationsZodSchema.refine((v) => v.type === "subtitle", {
                message: "Invalid type, only subtuitles are allowed",
              })
            ),
          }),
        },
      },
    },
  },
});

export type TGETObjectWithIdRoute = typeof GETObjectWithIdRoute;
