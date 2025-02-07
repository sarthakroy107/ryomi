import { updateUploadTableData } from "@/lib/queries/update-file-upload-status";
import { AppRouteHandler } from "@/lib/types";
import { TObjectUploadPUTRoute } from "@/lambda/hono-router/routes/upload.route";
import { awsHeaders } from "@/lib/app/aws-res-header";

export const confirmFileUploadHandler: AppRouteHandler<
  TObjectUploadPUTRoute
> = async (c) => {
  try {
    const user = c.get("user");

    if (!user || !user.email || !user.id) {
      return c.json(
        { message: "Unauthorized: User not found" },
        401,
        awsHeaders
      );
    }

    const { uploadTableId, uploadCompleted } = c.req.valid("json");

    await updateUploadTableData({
      id: uploadTableId,
      status: uploadCompleted,
      userId: user.id as string,
    });

    return c.json({ message: "File uploaded successfully" }, 200, awsHeaders);
  } catch (error) {
    return c.json({ message: error }, 500, awsHeaders);
  }
};
