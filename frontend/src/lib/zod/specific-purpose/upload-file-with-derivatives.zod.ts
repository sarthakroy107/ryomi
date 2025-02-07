import { z } from "zod";
import {
  FileTaskSchema,
  UploadFileSchema,
} from "@/lib/zod/genral-purpose/base-schemas.zod";

export const UploadFIleWithDerivativesSchema = z.object({
  file: UploadFileSchema,
  transcodes: z.array(FileTaskSchema.refine((op) => op.type === "transcode")),
  subtitles: z.array(FileTaskSchema.refine((op) => op.type === "subtitle")),
  conversions: z.array(
    FileTaskSchema.refine((op) => op.type === "conversion")
  ),
});

export type UploadFIleWithDerivatives = z.infer<
  typeof UploadFIleWithDerivativesSchema
>;
