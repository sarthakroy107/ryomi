import { reqHandler } from "@/lib/helpers/fetch.helper";
import { DownloadSchema } from "@/lib/zod/genral-purpose/base-schemas.zod";
import { useMutation } from "@tanstack/react-query";

export function useFileDownload() {
  const obj = useMutation({
    mutationKey: ["related-files"],
    mutationFn: async (fileIds: string[]) => {
      const resData = await reqHandler({
        method: "post",
        path: "/download",
        body: fileIds,
        resValidator: DownloadSchema,
      })

      const downloadFilesPromises = resData.map(async (file) => {
        const res = await fetch(file.url);
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
        window.URL.revokeObjectURL(url);
      });

      await Promise.all(downloadFilesPromises);
    },

  });

  return obj;
}
