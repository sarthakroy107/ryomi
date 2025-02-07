import { SelectUpload } from "@/db/schema";
import { TOperationSchema } from "@/lib/zod/operation-validator";

type TSubtitleService = {
  uploadedFile: SelectUpload;
  subtitleOperations: TOperationSchema["subtitles"];
};

export async function subtitleService({
  subtitleOperations,
  uploadedFile,
}: TSubtitleService) {
  try {
    return {
      success: true,
      message: "Subtitle queued(Not implemented yet)",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: `Error while queuing subtitle operations: ${error}`,
    };
  }
}
