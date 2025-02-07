import { z } from "zod";
import {
  nllb200LanguageCodes,
  operationsSchema,
  TNllb200LanguageCodes,
  TWhisperLanguages,
  whisperSupportedLanguages,
} from "./operation-validator";

const computeOptions = z.enum(["light", "moderate", "heavy", "extra heavy"]);
export type ComputeOptions = z.infer<typeof computeOptions>;

export const SQSMessageBodySchema = z.object({
  objectDownloadCommand: z.string(),
  transcode: z
    .object({
      ffmpegCommand: z.string(),
      outputUploadCommand: z.string(),
    })
    .nullable(),
  convert: z
    .object({
      ffmpegCommand: z.string(),
      outputUploadCommand: z.string(),
    })
    .nullable(),
  subtitles: z
    .object({
      ffmpegCommand: z.string(),
      fileName: z.string(),
      videoLanguage: z
        .enum(whisperSupportedLanguages)
        .or(z.literal("auto"))
        .default("auto"),
      subtitleLangs: z.string().refine(
        (lang) => {
          const langs = lang.split(",");
          //exclude thw lasst element which is an empty string
          langs.pop();
          return langs.every((l) =>
            nllb200LanguageCodes.includes(l as TNllb200LanguageCodes)
          );
        },
        { message: "Invalid language code in subtitle Langs" }
      ),
      subtitleUploadFolderWithShlash: z.string(),
    })
    .nullable(),
  compute: z.object({
    cpu: z.coerce.string(),
    memory: z.coerce.string(),
  }),
});

export type SQSMessageBody = z.infer<typeof SQSMessageBodySchema>;
