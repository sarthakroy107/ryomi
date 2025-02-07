"use client";
import { reqHandler } from "@/lib/helpers/fetch.helper";
import QueryKeys from "@/lib/query-keys";
import { UploadedFilesArrayShema } from "@/lib/zod/genral-purpose/base-schemas.zod";
import { ExtendedFile, useUploadStore } from "@/lib/zustand/upload-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";

export function useUploadMutate() {
  const {
    files: filesLoaded,
    changeUploadPercentage,
    clearFiles,
    uploadStatus,
  } = useUploadStore();

  const fileCount = filesLoaded.length;

  const { isPending, mutate, error, data } = useMutation({
    mutationFn: async (files: ExtendedFile[]) => {
      if (files.length === 0) {
        throw new Error("No files to upload");
      }

      const uploadPromises = files.map(async (file) => {
        const { uploadURL } = await reqHandler({
          path: "/upload",
          method: "post",
          body: {
            fileName: file.file.name,
            fileSize: file.file.size,
          },
          resValidator: z.object({
            uploadURL: z.string(),
          }),
        });

        // console.log(uploadURL);
        uploadStatus({ fileId: file.id, status: "uploading" });

        await axios
          .put(uploadURL, file.file, {
            headers: {
              "Content-Type": file.file.type,
            },

            onUploadProgress: (progressEvent) => {
              const percentage = Math.round(
                (progressEvent.loaded /
                  (progressEvent.total ?? progressEvent.loaded)) *
                  100
              );
              changeUploadPercentage({
                fileId: file.id,
                percentage,
              });
            },
          })
          .then(() => uploadStatus({ fileId: file.id, status: "success" }))
          .catch(() => uploadStatus({ fileId: file.id, status: "error" }));
      });

      await Promise.all(uploadPromises);
    },

    onSuccess: () => clearFiles(),
    onError: (err) => toast.error(err.message),
  });

  return { mutate, isPending, error, data, fileCount, filesLoaded };
}

export function useUploadedFiles() {
  const query = useQuery({
    queryKey: [QueryKeys.UPLOADED_FILES],
    queryFn: async () =>
      reqHandler({
        path: "/upload",
        method: "get",
        resValidator: UploadedFilesArrayShema,
      }),
  });

  return query;
}
