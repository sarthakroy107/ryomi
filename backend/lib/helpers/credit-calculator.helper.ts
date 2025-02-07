import { initialiseDB, TDB } from "@/db";
import { TOperationSchema } from "../zod/operation-validator";
import { userFileTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function calculateCredit({
  reqData,
  db,
}: {
  db?: TDB;
  reqData: TOperationSchema;
}): Promise<number> {
  if (!db) db = await initialiseDB();

  const { uploadTableId: fileId, transcode, convert, subtitles } = reqData;

  const file = await db
    .select()
    .from(userFileTable)
    .where(eq(userFileTable.id, fileId));

  if (!file[0]) throw new Error("File not found");

  const { size } = file[0];

  let credit = 10;

  transcode.forEach((item) => {
    credit += calculateCreaditForTranscode({ fileSize: size, transcode: item });
  });

  convert.forEach((item) => {
    credit += calculateCreditForConvert({ data: item });
  });

  subtitles.subtitleLanguages.forEach((item) => {
    credit += calculateCreditForSubtitle({ data: item });
  });

  return credit;
}

export function calculateCreaditForTranscode({
  fileSize,
  transcode,
}: {
  fileSize: number;
  transcode: TOperationSchema["transcode"][number];
}): number {
  const { format, scale } = transcode;

  let credit = 0;

  switch (scale) {
    case "7680:4320":
      credit += 3;
      break;
    case "3840:2160":
      credit += 3;
      break;
    case "2560:1440":
      credit += 2;
      break;
    case "1920:1080":
      credit += 2;
      break;
    case "1280:720":
      credit += 2;
      break;
    case "854:480":
      credit += 1;
      break;
    case "640:360":
      credit += 1;
      break;
    case "426:240":
      credit += 1;
      break;
    case "256:144":
      credit += 1;
      break;
    default:
      break;
  }

  if (
    (format === "avi" || format === "wmv" || format === "mov") &&
    fileSize >= 1073741824
  )
    credit += 1;

  return credit;
}

export function calculateCreditForConvert({
  data,
}: {
  data: TOperationSchema["convert"][number];
}): number {
  return data.length;
}

export function calculateCreditForSubtitle({
  data,
}: {
  data: TOperationSchema["subtitles"]["subtitleLanguages"][number];
}): number {
  return 3;
}
