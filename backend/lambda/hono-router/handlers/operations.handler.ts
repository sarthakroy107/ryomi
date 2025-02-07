import { AppRouteHandler } from "@/lib/types";
import { TOperationRoute } from "../routes/operation.route";
import { verifyUpload } from "@/lib/queries/verify-upload";
import { awsHeaders } from "@/lib/app/aws-res-header";
import { pushMessageToSQS } from "@/lib/aws/push-sqs";
import { honoEnv } from "../env";
import { ShellCommands } from "@/lib/helpers/shell-commands.helper";
import { operationsSchema } from "@/lib/zod/operation-validator";
import { initialiseDB } from "@/db";
import { insertFileOperationAndDeductCredit } from "@/lib/helpers/operation-table.helper";
import {
  calculateCreaditForTranscode,
  calculateCredit,
  calculateCreditForConvert,
  calculateCreditForSubtitle,
} from "@/lib/helpers/credit-calculator.helper";
import { deductCredit } from "@/lib/helpers/deduct-credit.helper";

export const operationsHandler: AppRouteHandler<TOperationRoute> = async (
  c
) => {
  try {
    const user = c.get("user");

    if (!user || user.id === undefined) {
      return c.json({ message: `User not found: ${user}` }, 400, awsHeaders);
    }

    const data = c.req.valid("json");
    console.log(data);

    const validatedData = operationsSchema.safeParse(data);

    if (!validatedData.success) {
      return c.json(
        { message: `Invalid data: ${validatedData.error}` },
        400,
        awsHeaders
      );
    }

    const uploadedFile = await verifyUpload({
      uploadTableId: data.uploadTableId,
    });

    if (
      uploadedFile.status === "not-uploaded" ||
      uploadedFile.status === "deleted"
    ) {
      return c.json(
        { message: "File not uploaded yet or have been deleted" },
        400,
        awsHeaders
      );
    }

    const db = await initialiseDB();

    const commands = new ShellCommands(uploadedFile, validatedData.data, db);
    console.log("Before filteration commands")
    const filteredTranscodes = await commands.filerExistinigTranscodes();
    const filteredConverts = await commands.filterExsitingConverts();
    const filteredSubtitles = await commands.filterExistingSubtitles();
    console.log("After filteration commands and before push to SQS")

    await pushMessageToSQS({
      sqsUrl: honoEnv.AWS_SQS_URL,
      dedeuplicationId: new Date().getTime().toString(),
      groupId: "hono-server",
      messageBody: {
        objectDownloadCommand: commands.uploadedFileDownloadCommand(),
        transcode: await commands.filteredTranscode(),
        subtitles: await commands.filteredSubtitle(),
        convert: await commands.filterConvert(),
        compute: {
          cpu: commands.filteredSubtitle() === null ? "4096" : "8192",
          memory: !commands.filteredSubtitle() === null ? "16384" : "57344",
        },
      },
    });

    console.log("After push to SQS")
    console.log("Before insertFileOperationAndDeductCredit")
    for (const config of filteredTranscodes) {
      await insertFileOperationAndDeductCredit({
        dbInstance: db,
        data: {
          s3_key: commands.generateTranscodeS3Key({ config }),
          type: "transcode",
          status: "in-progress",
          uploadTableId: data.uploadTableId,
          userId: user.id,
        },
        creditsUsed: calculateCreaditForTranscode({
          fileSize: uploadedFile.size,
          transcode: config,
        }),
      });
    }

    console.log("After insertFileOperationAndDeductCredit")
    for (const config of filteredConverts) {
      await insertFileOperationAndDeductCredit({
        dbInstance: db,
        data: {
          s3_key: commands.generateConvertS3Key(config),
          type: "conversion",
          status: "in-progress",
          uploadTableId: data.uploadTableId,
          userId: user.id,
        },
        creditsUsed: calculateCreditForConvert({
          data: config,
        }),
      });
    }

    console.log("After insertFileOperationAndDeductCredit")
    for (const config of filteredSubtitles) {
      await insertFileOperationAndDeductCredit({
        dbInstance: db,
        data: {
          s3_key: commands.generateSubtitleS3Key(config),
          type: "subtitle",
          status: "in-progress",
          uploadTableId: data.uploadTableId,
          userId: user.id,
        },
        creditsUsed: calculateCreditForSubtitle({ data: config }),
      });
    }

    console.log("After insertFileOperationAndDeductCredit")
    const totalUsedCredits = await calculateCredit({
      db: db,
      reqData: {
        uploadTableId: data.uploadTableId,
        transcode: filteredTranscodes,
        convert: filteredConverts,
        subtitles: {
          subtitleLanguages: filteredSubtitles,
          videoLanguage: validatedData.data.subtitles.videoLanguage,
        },
      },
    });

    console.log("After calculateCredit")
    await deductCredit({
      deductionAmount: totalUsedCredits,
      userId: user.id,
      db,
    });

    console.log("After deductCredit")
    return c.json(
      {
        transcode: {
          message: "Transcode started",
          success: true,
        },
        subtitle: {
          message: "Not implemented yet",
          success: true,
        },
        convert: {
          message: "Convert started",
          success: true,
        },
      },
      200,
      awsHeaders
    );
  } catch (error) {
    console.error(error);
    return c.json(
      { message: `Internal server error: ${error}` },
      500,
      awsHeaders
    );
  }
};

