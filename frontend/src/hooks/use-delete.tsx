import { reqHandler } from "@/lib/helpers/fetch.helper";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useFileDelete() {
  const obj = useMutation({
    mutationKey: ["related-files"],
    mutationFn: async (fileIds: string[]) => {
      await reqHandler({
        method: "delete",
        path: "/file",
        body: fileIds,
      });
    },
    onSuccess: () => toast.success("File deleted successfully"),
    onError: (error) => toast.error(`${error}`),
  });

  return obj;
}