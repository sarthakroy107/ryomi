"use client";

import { useDropzone } from "react-dropzone";
import { Input } from "./ui/input";
import { CloudUpload } from "lucide-react";
import { useCallback } from "react";
import { useUploadStore } from "@/lib/zustand/upload-store";

export function FileDropZone() {
  const appendFiles = useUploadStore((state) => state.appendFiles);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    appendFiles(acceptedFiles);
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  return (
    <section className="w-[19rem] md:w-[22rem] lg:w-[25rem]">
      <div
        {...getRootProps()}
        className="border border-white/10 w-full flex justify-center items-center h-40 rounded-sm bg-[#212121]/30  backdrop-blur-lg shadow-sm text-white/60 hover:text-white/75 transition"
      >
        <Input
          {...getInputProps({
            accept:
              "video/*, .mp4, .avi, .mkv, .mov, .wmv, .flv, .webm, .m4v, .hevc, .h265",
          })}
        />
        <div className="flex flex-col items-center gap-y-3">
          <CloudUpload size={32} />
          <p className="font-medium">Click or Drag n &apos; drop</p>
        </div>
      </div>
    </section>
  );
}
