"use client";
import { ExtendedFile, useUploadStore } from "@/lib/zustand/upload-store";
import { FileVideo, X } from "lucide-react";
import { formatBytes } from "@/lib/helpers/byte-formatter.helper";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Separator } from "./ui/separator";
import { H4Heading } from "./providers/h4-headings";

export function DisplayFile({ extendedFile }: { extendedFile: ExtendedFile }) {
  const deleteFile = useUploadStore((state) => state.deleteFile);
  const { } = useUploadStore();
  return (
    <div className="w-full flex justify-between items-center gap-x-1.5 p-1.5 rounded-[3px] dark:bg-white/10 backdrop-blur-md">
      <div className="flex gap-x-2 items-center">
        <div className="h-full">
          <FileVideo
            size={52}
            className={cn(
              "dark:text-white/80",
              extendedFile.status === "success" && "dark:text-green-500",
              extendedFile.status === "error" && "dark:text-red-600"
            )}
          />
        </div>
        <div className="py-0.5">
          <p className="text-sm dark:text-white/50 font-medium">
            {extendedFile.file.name}
          </p>
          <p className="text-sm dark:text-white/60 font-medium mb-0.5">
            {formatBytes(extendedFile.file.size)}
          </p>
          {extendedFile.status === "idle" ? (
            ""
          ) : extendedFile.status === "error" ? (
            <p className="text-red-500 text-xs">Error occured during upload</p>
          ) : extendedFile.status === "success" ? (
            <p className="text-green-400 text-xs">Uploaded</p>
          ) : (
            <Progress
              value={extendedFile.uploadPercentage}
              className="w-full h-1.5 mt-1 dark:text-white/50"
            />
          )}
        </div>
      </div>
      <Button
        onClick={() => deleteFile(extendedFile.id)}
        variant={"ghost"}
        className="group px-1.5 rounded-full h-8 w-8 transition"
      >
        <X
          size={20}
          className="cursor-pointer dark:text-white/50 group-hover:dark:text-red-600/70"
        />
      </Button>
    </div>
  );
}

export function MountedFileContainer() {
  const files = useUploadStore((state) => state.files);
  const [animation] = useAutoAnimate();
  return (
    <div className="dark:bg-white/5 w-full rounded-sm px-3 py-1">
      <H4Heading className="mb-1">Ready to upload</H4Heading>
      <Separator orientation="horizontal" className="my-2" />
      <div ref={animation} className="w-full min-h-20 space-y-2">
        {files.map((file) => (
          <DisplayFile key={file.id} extendedFile={file} />
        ))}
        {files.length === 0 && (
          <p className="text-center dark:text-white/50 mt-11 italic">
            No files to upload
          </p>
        )}
      </div>
    </div>
  );
}
