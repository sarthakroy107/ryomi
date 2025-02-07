import { operationsTable, SelectUpload } from "@/db/schema";
import {
  TNllb200LanguageCodes,
  TOperationSchema,
} from "@/lib/zod/operation-validator";
import { SQSMessageBody } from "../zod/sqs-message-body";
import { honoEnv } from "@/lambda/hono-router/env";
import { TDB } from "@/db";
import { and, eq, or } from "drizzle-orm";

type S3UrlPrefix =
  | {
      oprt: "upload"; // Upload to S3 bucket
      type: "transcodes" | "converts" | "subtitles";
    }
  | {
      oprt: "download"; // Download from S3 bucket
    };

export class ShellCommands {
  protected upload: SelectUpload;
  protected operation: TOperationSchema;
  protected transcodeS3UploadFolder: string;
  protected convertS3UploadFolder: string;
  protected subtitleS3UploadFolder: string;
  protected db: TDB;

  constructor(
    uploadTableData: SelectUpload,
    operation: TOperationSchema,
    db: TDB
  ) {
    if (uploadTableData.id !== operation.uploadTableId) {
      throw new Error("File id does not match operation file id");
    }

    this.upload = uploadTableData;
    this.operation = operation;
    this.transcodeS3UploadFolder = `${uploadTableData.userId}/${this.upload.id}/transcodes`;
    this.convertS3UploadFolder = `${uploadTableData.userId}/${this.upload.id}/converts`;
    this.subtitleS3UploadFolder = `${uploadTableData.userId}/${this.upload.id}/subtitles`;
    this.db = db;
  }

  public completeFileName() {
    const name = this.upload.s3Key.split("/").pop();
    if (!name) throw new Error("File name not found");
    return name;
  }

  protected s3UrlFomrat(data: S3UrlPrefix) {
    if (data.oprt === "download")
      return `s3://${honoEnv.AWS_S3_INPUT_BUCKET_NAME}/${this.upload.userId}/${this.upload.id}/`;
    else
      return `s3://${honoEnv.AWS_S3_OUTPUT_BUCKET_NAME}/${this.upload.userId}/${this.upload.id}/${data.type}`;
  }

  public uploadedFileDownloadCommand() {
    return `aws s3 cp s3://${honoEnv.AWS_S3_INPUT_BUCKET_NAME}/${
      this.upload.s3Key
    } ${this.completeFileName()}`;
  }

  protected generateTranscodeFileName(data: TOperationSchema["transcode"][0]) {
    const inputVideoName = this.completeFileName();
    const lastIndexOfDot = inputVideoName.lastIndexOf(".");
    const onlyName = inputVideoName.slice(0, lastIndexOfDot);

    return `${onlyName}-${data.scale.split(":")[1]}.${data.format}`;
  }

  public generateTranscodeS3Key({
    config,
  }: {
    config: TOperationSchema["transcode"][0];
  }) {
    return `${this.transcodeS3UploadFolder}/${this.generateTranscodeFileName(
      config
    )}`;
  }

  public getTranscodeS3Keys() {
    return this.operation.transcode.map((config) =>
      this.generateTranscodeS3Key({ config })
    );
  }

  public async filerExistinigTranscodes() {
    const filteredArr: TOperationSchema["transcode"] = [];

    for (const config of this.operation.transcode) {
      const result = await this.db
        .select()
        .from(operationsTable)
        .where(
          and(
            eq(operationsTable.s3_key, this.generateTranscodeS3Key({ config })),
            eq(operationsTable.type, "transcode"),
            or(
              eq(operationsTable.status, "in-progress"),
              eq(operationsTable.status, "complete")
            )
          )
        );
      if (result.length === 0) {
        filteredArr.push(config);
      }
    }
    return filteredArr;
  }

  public async filteredTranscodeS3Keys() {
    const filteredArr: string[] = [];

    const filteredConfigs = await this.filerExistinigTranscodes();

    for (const config of filteredConfigs) {
      filteredArr.push(this.generateTranscodeS3Key({ config }));
    }
    console.log(filteredArr);
    return filteredArr;
  }

  public async filteredTranscode(): Promise<SQSMessageBody["transcode"]> {
    console.log("filteredTranscodeList: start");
    if (this.operation.transcode.length === 0) {
      return null;
    }

    const inputVideoName = this.completeFileName();
    const transcodeArray = await this.filerExistinigTranscodes();
    const len = transcodeArray.length;
    //console.log("filteredTranscodeList: transcodeArray: ", transcodeArray);

    if (!inputVideoName) {
      throw new Error("Object name not found");
    }

    //*Example command: ffmpeg -i input_video.mp4 -filter_complex "[0:v]split=5[stream1][stream2][stream3][stream4][stream5];[stream1]scale=1920:1080[output1];[stream2]scale=1280:720[output2];[stream3]scale=854:480[output3];[stream4]scale=640:360[output4];[stream5]scale=320:180[output5]" -map "[output1]" output_video_1080p.mp4 -map "[output2]" output_video_720p.mp4 -map "[output3]" output_video_480p.mp4 -map "[output4]" output_video_360p.mp4 -map "[output5]" output_video_180p.mp4

    //*Part one: ffmpeg -i input_video.mp4 -filter_complex "
    let command = `ffmpeg -i ${inputVideoName} -filter_complex "`;

    //*Part two-a: [0:v]split=5
    let streams = `[0:v]split=${len}`;
    let scaleOperations = "";
    let outputs = "";

    for (let i = 1; i <= len; i++) {
      // console.log("i-1: ", i - 1);
      // console.log(`1-> transcodeArray[${i - 1}]: `, transcodeArray[i - 1]);
      //*Part two-b: [v1][v2][v3][v4][v5]
      streams += `[v${i}]`;

      //console.log("2-> streams: ", streams);
      //*Part 3-b: scale=1920:1080[output1]; ...
      const scale = `[v${i}]scale=${transcodeArray[i - 1].scale}[output_${i}];`;
      scaleOperations += scale;

      //console.log("3-> scaleOperations: ");
      //*Part 4: -map "[output1]" output_video_1080p.mp4
      const output = ` -map "[output_${i}]" /output/${this.generateTranscodeFileName(
        transcodeArray[i - 1]
      )}`;

      outputs += output;
      //console.log("4-> outputs: ");
    }

    //*Part-2-c: ;
    streams += `;`;

    command += streams;
    command += scaleOperations;
    command += `"`;

    command += outputs;

    const uploadBucketUrl = this.s3UrlFomrat({
      oprt: "upload",
      type: "transcodes",
    });

    const awsUploadCommand = `aws s3 cp /output ${uploadBucketUrl} --recursive`;

    console.log("filteredTranscodeL: end");
    return {
      ffmpegCommand: command,
      outputUploadCommand: awsUploadCommand,
    };
  }

  public convertionFilename(data: TOperationSchema["convert"][0]) {
    const inputVideoName = this.completeFileName();
    const lastIndexOfDot = inputVideoName.lastIndexOf(".");
    const onlyName = inputVideoName.slice(0, lastIndexOfDot);

    return `${onlyName}.${data}`;
  }

  public generateConvertS3Key(data: TOperationSchema["convert"][0]) {
    return `${this.convertS3UploadFolder}/${this.convertionFilename(data)}`;
  }

  public getConvertS3Keys() {
    return this.operation.convert.map((config) =>
      this.generateConvertS3Key(config)
    );
  }

  public async filterExsitingConverts() {
    const filteredArr: TOperationSchema["convert"] = [];

    for (const config of this.operation.convert) {
      const result = await this.db
        .select()
        .from(operationsTable)
        .where(
          and(
            eq(operationsTable.s3_key, this.generateConvertS3Key(config)),
            eq(operationsTable.type, "conversion"),
            or(
              eq(operationsTable.status, "in-progress"),
              eq(operationsTable.status, "complete")
            )
          )
        );

      if (result.length === 0) {
        filteredArr.push(config);
      }
    }
    //console.log(filteredArr);
    return filteredArr;
  }

  public async getFilteredConvertS3keys() {
    const filteredArr: string[] = [];

    const filteredConfigs = await this.filterExsitingConverts();

    for (const config of filteredConfigs) {
      filteredArr.push(this.generateConvertS3Key(config));
    }

    return filteredArr;
  }

  public async filterConvert(): Promise<SQSMessageBody["convert"]> {
    //console.log("filterConvert: start");
    if (this.operation.convert.length === 0) {
      return null;
    }

    const inputVideoName = this.completeFileName();
    const convertArray = await this.filterExsitingConverts();

    if (!inputVideoName) {
      throw new Error("Object name could not be determined from s3Key.");
    }

    // Extract the base name (without extension) for output files
    const lastIndexOfDot = inputVideoName.lastIndexOf(".");
    const onlyName = inputVideoName.slice(0, lastIndexOfDot);

    // Define the output directory and prefix for output file names
    const outputDir = "/output";
    const outputfilePrefix = `${outputDir}/${onlyName}`;

    // Initialize FFmpeg command
    let ffmpegCommand = `ffmpeg -i ${inputVideoName}`;

    // Add each output format specified in the `data` array
    convertArray.forEach((format) => {
      ffmpegCommand += ` -q:a 0 -map 0 /output/${this.convertionFilename(
        format
      )}`;
    });

    // AWS upload command to copy the entire output directory to S3
    const awsUploadCommand = `aws s3 cp ${outputDir} ${this.s3UrlFomrat({
      oprt: "upload",
      type: "converts",
    })} --recursive`;

    //console.log("filterConvert: end");
    return {
      ffmpegCommand: ffmpegCommand,
      outputUploadCommand: awsUploadCommand,
    };
  }

  public subtitleFilename(lan: TNllb200LanguageCodes) {
    const inputVideoName = this.completeFileName();
    const lastIndexOfDot = inputVideoName.lastIndexOf(".");
    const onlyName = inputVideoName.slice(0, lastIndexOfDot);

    return `${onlyName}-${lan.split("_")[0]}.srt`;
  }

  public generateSubtitleS3Key(lan: TNllb200LanguageCodes) {
    return `${this.subtitleS3UploadFolder}/${this.subtitleFilename(lan)}`;
  }

  public getSubtitleS3Keys() {
    return this.operation.subtitles.subtitleLanguages.map((lan) =>
      this.generateSubtitleS3Key(lan)
    );
  }

  public async filterExistingSubtitles() {
    const arr: TNllb200LanguageCodes[] = [];

    for (const lang of this.operation.subtitles.subtitleLanguages) {
      const result = await this.db
        .select()
        .from(operationsTable)
        .where(
          and(
            eq(operationsTable.s3_key, this.generateSubtitleS3Key(lang)),
            eq(operationsTable.type, "subtitle"),
            or(
              eq(operationsTable.status, "in-progress"),
              eq(operationsTable.status, "complete")
            )
          )
        );

      if (result.length === 0) {
        arr.push(lang);
      }
    }

    //console.log(arr);

    return arr;
  }

  public async filteredSubtitleS3Keys() {
    console.log("filteredSubtitleS3Keys: start");
    const filteredArr: string[] = [];

    const filteredLangs = await this.filterExistingSubtitles();

    for (const lang of filteredLangs) {
      filteredArr.push(this.generateSubtitleS3Key(lang));
    }

    return filteredArr;
  }

  public async filteredSubtitle(): Promise<SQSMessageBody["subtitles"]> {
    if (this.operation.subtitles.subtitleLanguages.length === 0) {
      return null;
    }

    // console.log("Not implemented yet");
    let whisperCommand = `whisper audiofile.mp3 --model medium`;

    if (this.operation.subtitles.videoLanguage !== "auto") {
      whisperCommand += ` --lang ${this.operation.subtitles.videoLanguage}`;
    }

    let langs: string = "";
    const filteredSubtitleLangs: TNllb200LanguageCodes[] =
      await this.filterExistingSubtitles();

    const subLen = filteredSubtitleLangs.length;

    for (let i = 0; i < subLen; i++) {
      if (i !== 0) langs += ",";
      langs += `${this.operation.subtitles.subtitleLanguages[i]}`;
    }

    //console.log("filteredSubtitleS3Keys: end");
    return {
      ffmpegCommand: `ffmpeg -i ${this.completeFileName()} audiofile.mp3`,
      videoLanguage: this.operation.subtitles.videoLanguage,
      subtitleLangs: langs,
      fileName: this.completeFileName(),
      subtitleUploadFolderWithShlash: `${honoEnv.AWS_S3_OUTPUT_BUCKET_NAME}/${this.subtitleS3UploadFolder}`,
    };
  }
}
