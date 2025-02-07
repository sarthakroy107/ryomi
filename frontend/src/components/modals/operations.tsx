"use client";
import { useUploadedFiles } from "@/hooks/use-upload";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBytes } from "@/lib/helpers/byte-formatter.helper";
import { useOperationStore } from "@/lib/zustand/operation-store";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { s3KeyNameFormatter } from "@/lib/helpers/name-formatter.helper";
import { useModalStore } from "@/lib/zustand/dialog-store";
import { H3Heading } from "../providers/h3-heading";
import { Modal } from "./modal";

export function SelectFileModalTrigger() {
  const { file: selectedFile, removeFile } = useOperationStore();
  const { setOpen } = useModalStore();
  return (
    <div className="w-full">
      <H3Heading>Select File</H3Heading>
      <div className="flex flex-col md:flex-row items-center gap-x-3">
        <div className="border border-white/1- rounded-l-full w-[22rem] lg:w-[26rem] h-11 rounded-r-full md:rounded-r-[2px] flex items-center pl-6 pr-3">
          {s3KeyNameFormatter(selectedFile?.s3Key, 25)}
        </div>
        <div className="flex gap-x-2 mt-3 md:mt-0">
          <Button
            onClick={() =>
              setOpen({ type: "select-uploaded-file", isOpen: true })
            }
          >
            Select file
          </Button>
          <Button
            disabled={!selectedFile}
            variant={"secondary"}
            onClick={() => removeFile()}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}

export function OperationsModal() {
  const { file: selectedFile, removeFile } = useOperationStore();

  return (
    <Modal title="Select file" type={"select-uploaded-file"}>
      <UploadedFileTable />
      <div className="w-full flex justify-between">
        <DialogClose
          disabled={selectedFile === null}
          // className="rounded-sm dark:bg-white dark:text-black px-4 py-1.5 font-medium"
          asChild
        >
          <Button>Select</Button>
        </DialogClose>
        <Button
          disabled={selectedFile === null}
          onClick={() => removeFile()}
          variant={"outline"}
          className="w-fit"
        >
          Clear
        </Button>
      </div>
    </Modal>
  );
}

export function UploadedFileTable() {
  const { data } = useUploadedFiles();
  const { file: selectedFile, setFile } = useOperationStore();

  return (
    <ScrollArea className="w-full h-96">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Select</TableHead>
            <TableHead>File name</TableHead>
            <TableHead>File size</TableHead>
            <TableHead>Uploaded on</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((file) => (
              <TableRow key={file.s3Key}>
                <TableCell>
                  <button
                    onClick={() => setFile(file)}
                    className="border border-white/30 rounded-full w-5 h-5 flex justify-center items-center"
                  >
                    <div
                      className={cn(
                        selectedFile && selectedFile.id === file.id
                          ? "w-2.5 h-2.5 bg-white/80 rounded-full"
                          : ""
                      )}
                    />
                  </button>
                </TableCell>
                <TableCell>{file.s3Key.split("/").pop()}</TableCell>
                <TableCell>{formatBytes(file.size)}</TableCell>
                <TableCell>{file.createdAt}</TableCell>
              </TableRow>
            ))
          ) : (
            <></>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
