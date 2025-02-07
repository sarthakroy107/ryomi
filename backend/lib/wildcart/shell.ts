import { TOperationSchema } from "../zod/operation-validator";
import { objectNameFromS3Key } from "./get-object-name";

export function generateFFmpegCommand({
  s3_key,
  transcode,
  // convert,
  // subtitles
}: {
  s3_key: string;
  transcode: TOperationSchema["transcode"];
  // convert: TOperationSchema["convert"];
  // subtitles: TOperationSchema["subtitling"];
}) {
  const len = transcode.length;
  const objectName = objectNameFromS3Key(s3_key);

  const ouputfilePrefix = `/output/${objectName?.split(".")[0]}`;

  //*Example command: ffmpeg -i input_video.mp4 -filter_complex "[0:v]split=5[stream1][stream2][stream3][stream4][stream5];[stream1]scale=1920:1080[output1];[stream2]scale=1280:720[output2];[stream3]scale=854:480[output3];[stream4]scale=640:360[output4];[stream5]scale=320:180[output5]" -map "[output1]" output_video_1080p.mp4 -map "[output2]" output_video_720p.mp4 -map "[output3]" output_video_480p.mp4 -map "[output4]" output_video_360p.mp4 -map "[output5]" output_video_180p.mp4

  //*Part one: ffmpeg -i input_video.mp4 -filter_complex "
  let command = `ffmpeg -i ${objectName} -filter_complex "`;

  //*Part two-a: [0:v]split=5
  let streams = `[0:v]split=${len}`;
  let scaleOperations = "";
  let outputs = "";

  for (let i = 1; i <= len; i++) {
    //*Part two-b: [v1][v2][v3][v4][v5]
    streams += `[v${i}]`;

    //*Part 3-b: scale=1920:1080[output1]; ...
    const scale = `[v${i}]scale=${transcode[i - 1].scale}[output_${i}];`;
    scaleOperations += scale;

    //*Part 4: -map "[output1]" output_video_1080p.mp4
    const output = ` -map "[output_${i}]" ${ouputfilePrefix}_${
      transcode[i - 1].scale.split(":")[1]
    }.${transcode[i - 1].format}`;

    outputs += output;
  }

  //*Part-2-c: ;
  streams += `;`;

  command += streams;
  command += scaleOperations;
  command += `"`;

  command += outputs;

  return command;
}