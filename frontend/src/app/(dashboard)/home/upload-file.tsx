"use client";

import { MountedFileContainer } from "@/components/file-comp";
import { FileDropZone } from "@/components/file-upload";
import { H3Heading } from "@/components/providers/h3-heading";
import { Button } from "@/components/ui/button";
import { useUploadMutate } from "@/hooks/use-upload";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

export function FileUploadComponent() {
  const { mutate, fileCount, filesLoaded } = useUploadMutate();
  return (
    <div className="w-fit space-y-4 px-5">
      <div className="w-full flex justify-between items-center">
        <H3Heading>Upload Files</H3Heading>
        <Button
          disabled={fileCount === 0}
          className={cn(
            "text-sm px-4 h-8 font-medium rounded-full",
            fileCount > 0 ? "flex" : "hidden"
          )}
          onClick={() => mutate(filesLoaded)}
          title="Upload files"
        >
          Upload
          <Upload size={16} className="ml-1" />
        </Button>
      </div>
      <FileDropZone />
      <MountedFileContainer />
    </div>
  );
}
