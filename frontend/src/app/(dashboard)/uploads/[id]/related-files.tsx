"use client";

import { DataTable } from "@/components/data-table/data-table";
import { H4Heading } from "@/components/providers/h4-headings";
import { cn } from "@/lib/utils";
import { UploadFIleWithDerivatives } from "@/lib/zod/specific-purpose/upload-file-with-derivatives.zod";
import { useState } from "react";
import {
  convertFileColumnDef,
  subtitleFileColumnDef,
  transcodeFileColumnDef,
} from "./column-def";

type TOperqationCategories = "transcode" | "convert" | "subtitle";

export function RelatedFileDetails({
  transcodes,
  conversions,
  subtitles,
}: {
  transcodes: UploadFIleWithDerivatives["transcodes"];
  conversions: UploadFIleWithDerivatives["conversions"];
  subtitles: UploadFIleWithDerivatives["subtitles"];
}) {
  const [tab, setTab] = useState<TOperqationCategories>("transcode");
  return (
    <div className="w-full border dark:border-white/10 dark:bg-[#212121]/15 min-h-48 rounded-md lg:p-3 lg:px-7">
      <H4Heading className="ml-2">Related files</H4Heading>
      <div className="">
        <div className="rounded-sm text-white/60 font-medium mt-2 px-3 relative top-[1px]">
          {options.map((option, i) => (
            <button
              key={i}
              className={cn(
                "px-2.5 py-1 border border-transparent",
                tab === option.category && className
              )}
              onClick={() => setTab(option.category)}
            >
              {option.name}
            </button>
          ))}
        </div>
        <div className="w-full dark:bg-white/5 rounded-[3px] border dark:border-white/10 p-2.5">
          {tab === "transcode" && (
            <DataTable data={transcodes} columns={transcodeFileColumnDef} />
          )}
          {tab === "convert" && (
            <DataTable data={conversions} columns={convertFileColumnDef} />
          )}
          {tab === "subtitle" && (
            <DataTable data={subtitles} columns={subtitleFileColumnDef} />
          )}
        </div>
      </div>
    </div>
  );
}

const options: {
  name: string;
  category: TOperqationCategories;
}[] = [
  {
    name: "Transcodes",
    category: "transcode",
  },
  {
    name: "Converts",
    category: "convert",
  },
  {
    name: "Subtitles",
    category: "subtitle",
  },
];

const className =
  "dark:bg-white/5 border-x border-t dark:border-gray-300/10 rounded-t-[3px] transition border-b dark:border-b-black/50";
