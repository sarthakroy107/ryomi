"use client";
import { uplaodedFileColumnsDef } from "@/components/data-table/colum-defs/upload-columns";
import { DataTable } from "@/components/data-table/data-table";
import { H2Heading } from "@/components/providers/h2-heading";
import { useUploadedFiles } from "@/hooks/use-upload";
import { cn } from "@/lib/utils";
import { RotateLoader } from "react-spinners";

export default function UploadedFilePage() {
  const { data, isLoading } = useUploadedFiles();
  return (
    <main className={cn("w-full flex justify-center")}>
      <div
        className={cn(
          "w-full lg:w-4/5 overflow-auto flex flex-col items-center"
        )}
      >
        <div className="w-full pl-2">
          <H2Heading className="">Uploads</H2Heading>
        </div>
        {isLoading && (
          <p className="w-full h-[45rem] flex justify-center items-center">
            <RotateLoader color="white" size={11} />
          </p>
        )}
        {data && (
          <DataTable
            classNameTableBody=""
            columns={uplaodedFileColumnsDef}
            data={data}
          />
        )}
      </div>
    </main>
  );
}
