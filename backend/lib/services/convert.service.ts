import { SelectUpload } from "@/db/schema";
import { TOperationSchema } from "@/lib/zod/operation-validator";

type TSubtitleService = {
  uploadedFile: SelectUpload;
  convertOperations: TOperationSchema["convert"];
};

export async function convertService({
  convertOperations,
  uploadedFile,
}: TSubtitleService) {
  try {
    return {
      success: true,
      message: "Subtitle queued(Not implemeted yet)",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: `Error while queuing subtitle operations: ${error}`,
    };
  }
}
