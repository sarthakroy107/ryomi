"use client";

import { H4Heading } from "@/components/providers/h4-headings";
import { formatBytes } from "@/lib/helpers/byte-formatter.helper";
import { formatDate } from "@/lib/helpers/date-formatter";
import { TUploadedFile } from "@/lib/zod/genral-purpose/base-schemas.zod";

export function FileDetails({ file }: { file: TUploadedFile }) {
  return (
    <div className="w-full dark:bg-gradient-to-b from-[#212121]/70 via-[#212121] to-[#212121]/70 min-h-48 rounded-md p-3 lg:p-3 lg:px-7">
      <H4Heading>File details</H4Heading>
      <div className="flex flex-col md:flex-row flex-wrap justify-between gap-3 px-1.5 lg:px-2.5">
        <Detail title="File name" value={file.fileName || "No file name"} />
        <Detail title="Size" value={formatBytes(file.size)} />
        <Detail title="Uploaded at" value={formatDate(file.createdAt)} />
        <Detail title="Available till" value={formatDate(file.saveTill)} />
      </div>
    </div>
  );
}

function Detail({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <p className="text-xs md:text-sm dark:text-white/80">{title}</p>
      <p className="text-sm md:text-base dark:text-white font-medium">
        {value}
      </p>
    </div>
  );
}
