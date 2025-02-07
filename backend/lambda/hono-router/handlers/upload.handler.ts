import { getS3SignedPutUrl } from "@/lib/aws/presigned-put-url";
import { AppRouteHandler } from "@/lib/types";
import {
  TGETObjectWithIdRoute,
  TObjectUploadGETRoute,
  TObjectUploadPOSTRoute,
} from "@/lambda/hono-router/routes/upload.route";
import { awsHeaders } from "@/lib/app/aws-res-header";
import {
  getObjectByIdHelper,
  getUploadedObjects,
} from "@/lib/helpers/uploaded-file.helper";
import { getOperationsByUploadTableId } from "@/lib/helpers/operations.helper";

export const getPresignedUrlHandler: AppRouteHandler<
  TObjectUploadPOSTRoute
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

    const { fileName, fileSize } = c.req.valid("json");

    if (!fileName || !fileSize) {
      return c.json(
        { message: "Invalid request: fileName or fileSize missing" },
        400,
        awsHeaders
      );
    }

    const date = new Date(Date.now())
      .toISOString()
      .replace(/[\/\\:*?"<>|&%~^'" ]/g, "_");

    const objKey = `${user.id}/${date}-${fileName.replace(
      /[\/\\:*?"<>|&%~^'" ]/g,
      "_"
    )}`;

    const s3PutUrl = await getS3SignedPutUrl({
      objKey,
    });

    return c.json({ uploadURL: s3PutUrl }, 200, awsHeaders);
  } catch (error) {
    return c.json(
      { message: `Internal server error: ${error}` },
      500,
      awsHeaders
    );
  }
};

export const getUploadedFilesHandler: AppRouteHandler<
  TObjectUploadGETRoute
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

    const objects = await getUploadedObjects(user.id);

    return c.json(objects, 200, awsHeaders);
  } catch (error) {
    console.error(error);
    return c.json(
      { message: `Internal server error: ${error}` },
      500,
      awsHeaders
    );
  }
};

export const getObjByIdWithDerivedObjsHandler: AppRouteHandler<
  TGETObjectWithIdRoute
> = async (c) => {
  const { id } = c.req.param();

  if (!id) {
    return c.json({ message: "Invalid request: id missing" }, 400, awsHeaders);
  }

  try {
    const file = await getObjectByIdHelper(id);
    const operations = await getOperationsByUploadTableId(file.id);

    return c.json({
      file,
      transcodes: operations.filter((file) => file.type === "transcode"),
      conversions: operations.filter((file) => file.type === "conversion"),
      subtitles: operations.filter((file) => file.type === "subtitle"),
    }, 200, awsHeaders);
  } catch (error) {
    console.error(error);

    return c.json({ message: `Internal Sever Error: ${error}` }, 500, awsHeaders);
  }
};
