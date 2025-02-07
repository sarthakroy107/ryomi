import { AppRouteHandler } from "@/lib/types";
import { TDeleteFileRoute, TDownloadFileRoute } from "../routes/file.route";
import { awsHeaders } from "@/lib/app/aws-res-header";
import { initialiseDB } from "@/db";
import { operationsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getS3SignedGetUrl } from "@/lib/aws/presigned-get-url";
import { deleteS3Object } from "@/lib/aws/delete-s3-object";

export const downlaodHandler: AppRouteHandler<TDownloadFileRoute> = async (
  c
) => {
  try {
    const user = c.get("user");

    if (!user) return c.json({ message: "Unauthorized" }, 401, awsHeaders);

    const body = c.req.valid("json");

    const db = await initialiseDB();

    const len = body.length;

    if (len === 0) {
      return c.json({ message: `No file ids found` }, 400, awsHeaders);
    }
    const s3BucketName = process.env.AWS_S3_OUTPUT_BUCKET_NAME;

    if (!s3BucketName) throw new Error("S3 bucket name not found in env");

    const resObj: { url: string; name: string }[] = [];

    for (let i = 0; i < len; i++) {
      const id = body[i];

      const file = await db
        .select()
        .from(operationsTable)
        .where(eq(operationsTable.id, id));

      if (!file[0]) {
        return c.json(
          { message: `File not found with id: ${id}` },
          404,
          awsHeaders
        );
      }

      if (file[0].userId !== user.id) {
        return c.json(
          { message: `Unauthorized to download file with id: ${id}` },
          401,
          awsHeaders
        );
      }

      const url = await getS3SignedGetUrl(
        file[0].s3_key,
        s3BucketName,
        60 * 60 * 3
      );

      const fileName = file[0].s3_key.split("/").pop();

      if (!fileName) {
        throw new Error(`File name not found for file id: ${id}`);
      }

      resObj.push({ url, name: fileName });
    }

    return c.json(resObj, 200, awsHeaders);
  } catch (error) {
    console.error(error);
    return c.json(
      { message: `Internal Server Error: ${error}` },
      500,
      awsHeaders
    );
  }
};

export const deleteFileHanlder: AppRouteHandler<TDeleteFileRoute> = async (
  c
) => {
  try {
    const user = c.get("user");
    const l = c.req.header("Authorization");

    console.log("Authorization: ", l);

    console.log("User: ", user);

    if (!user)
      return c.json(
        { message: "Unauthorized: user details not found" },
        401,
        awsHeaders
      );

    const body = c.req.valid("json");

    if (body.length === 0) {
      return c.json({ message: `No file ids found` }, 400, awsHeaders);
    }

    const bucketName = process.env.AWS_S3_OUTPUT_BUCKET_NAME;

    if (!bucketName) throw new Error("S3 bucket name not found in env");

    const db = await initialiseDB();

    const len = body.length;

    for (let i = 0; i < len; i++) {
      const id = body[i];

      const file = await db
        .select()
        .from(operationsTable)
        .where(eq(operationsTable.id, id));

      if (!file[0]) {
        return c.json(
          { message: `File not found with id: ${id}` },
          404,
          awsHeaders
        );
      }

      if (file[0].userId !== user.id) {
        return c.json(
          { message: `Unauthorized to delete file with id: ${id}` },
          401,
          awsHeaders
        );
      }

      await deleteS3Object({ bucketName, key: file[0].s3_key });

      await db.delete(operationsTable).where(eq(operationsTable.id, id));

      console.log(`File with id: ${id} deleted successfully`);
    }

    return c.json({ message: "File deleted successfully" }, 200, awsHeaders);
  } catch (error) {
    console.error(error);
    return c.json(
      { message: `Internal Server Error: ${error}` },
      500,
      awsHeaders
    );
  }
};
