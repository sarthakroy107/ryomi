"use client";
import { reqHandler } from "@/lib/helpers/fetch.helper";
import { FileDetails } from "./details";
import { UploadFIleWithDerivativesSchema } from "@/lib/zod/specific-purpose/upload-file-with-derivatives.zod";
import { RelatedFileDetails } from "./related-files";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { PageLoader } from "@/components/common/loader";
import { PageError } from "@/components/common/error";

export default function FilePage() {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useQuery({
    queryKey: [id, "related-files"],
    queryFn: async () => {
      const res = await reqHandler({
        path: `/upload/${id}`,
        method: "get",
        resValidator: UploadFIleWithDerivativesSchema,
      });
      return res;
    },
  });

  if (isLoading || !data) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError message={error.message} />;
  }

  if (!data) {
    return <PageError message="No data found" />;
  }

  console.log(data);

  return (
    <div className="w-full flex flex-col items-center gap-y-5 md:gap-y-10 lg:gap-y-14 p-2 md:p-4 lg:p-8">
      <FileDetails file={data.file} />
      <RelatedFileDetails {...data} />
    </div>
  );
}
