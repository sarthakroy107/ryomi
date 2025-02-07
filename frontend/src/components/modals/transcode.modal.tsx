"use client";

import { useOperationStore } from "@/lib/zustand/operation-store";
import { Modal } from "./modal";

import {
  codecsArray,
  scalingOptions,
  TConvertFormatOptions,
  TScalingOptions,
} from "@/lib/zod/operation-validator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DataTable } from "../data-table/data-table";
import { transcodeColumnDef } from "../data-table/colum-defs/operations-colums";

export function TranscodeModal() {
  const { transcode } = useOperationStore();
  return (
    <Modal title="Transcode options" type={"transcode-modal"}>
      <TranscodeOptions />
      {transcode && transcode.length > 0 && (
        <DataTable columns={transcodeColumnDef} data={transcode} />
      )}
    </Modal>
  );
}

export function TranscodeOptions() {
  const { file, appendTranscode } = useOperationStore();
  const [openScalePop, setOpenScalePop] = useState(false);
  const [openFormatPop, setOpenFormatPop] = useState(false);
  const [scale, setScale] = useState<TScalingOptions | null>();
  const [format, setFormat] = useState<TConvertFormatOptions | null>(
    file?.s3Key.split(".").pop() as TConvertFormatOptions
  );
  return (
    <div className="flex justify-between">
      <Popover open={openScalePop} onOpenChange={setOpenScalePop}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openScalePop}
            className="w-[200px] justify-between"
          >
            {scale ? scale.split(":").pop() : "Select scale"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Seacrh scale" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {scalingOptions.map((scaleValue) => (
                  <CommandItem
                    key={scaleValue}
                    value={scaleValue}
                    onSelect={(currentValue) => {
                      setScale(currentValue as TScalingOptions);
                      setOpenScalePop(false);
                    }}
                    className="text-white"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        scale === scaleValue ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {scaleValue.split(":").pop()}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {/*
        //*****************************************************
        //********************Format options********************
        //*****************************************************
      */}
      <Popover open={openFormatPop} onOpenChange={setOpenFormatPop}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openScalePop}
            className="w-[200px] justify-between"
          >
            {format ? "." + format.split(".").pop() : "Select format"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search format" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {codecsArray.map((formatValue) => (
                  <CommandItem
                    key={formatValue}
                    value={formatValue}
                    onSelect={(currentValue) => {
                      setFormat(currentValue as TConvertFormatOptions);
                      setOpenFormatPop(false);
                    }}
                    className="text-white"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        format == formatValue ? "opacity-100" : "opacity-0"
                      )}
                    />
                    .{formatValue.split(".").pop()}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button
        disabled={!format || !scale}
        onClick={() => {
          if (format && scale) {
            appendTranscode({
              format,
              scale,
            });
          } else {
            toast.error("Please select format and scale");
          }
        }}
        className="w-20 rounded-full"
      >
        <PlusCircle />
        Add
      </Button>
    </div>
  );
}
