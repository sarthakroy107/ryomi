"use client";

import { reqHandler } from "@/lib/helpers/fetch.helper";
import {
  operationsSchema,
  TOperationSchema,
} from "@/lib/zod/operation-validator";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export function useOperationMutation() {
  const hook = useMutation({
    mutationFn: async (data: TOperationSchema) => {
      const pareseResult = operationsSchema.safeParse(data);

      if (!pareseResult.success) {
        throw new Error("Invalid operation data");
      }

      const { convert, subtitle, transcode } = await reqHandler({
        path: "/operation",
        method: "post",
        body: pareseResult.data,
        resValidator: z.object({
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
      });

      if (transcode.success && subtitle.success && convert.success) {
        return true;
      } else {
        let message = "Failed to perform operations:";
        if (!transcode.success) {
          console.error(transcode.message);
          message = " " + transcode.message;
        }
        if (!subtitle.success) {
          console.error(subtitle.message);
          message = " " + subtitle.message;
        }
        if (!convert.success) {
          console.error(convert.message);
          message = " " + convert.message;
        }
        throw new Error(message);
      }
    },
    onSuccess: () => toast.success("Operations started successfully"),
    onError: (error) => toast.error(error.message),
  });

  return hook;
}
