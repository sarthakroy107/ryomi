"use client";

import { useOperationStore } from "@/lib/zustand/operation-store";
import { Modal } from "./modal";

import {
  codecsArray,
  scalingOptions,
  TConvertFormatOptions,
  TOperationSchema,
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
import {
  convertColumnDef,
} from "../data-table/colum-defs/operations-colums";

export function ConvertModal() {
  const { convert } = useOperationStore();
  return (
    <Modal title="Format convert options" type={"convert-modal"}>
      <ConvertOptions />
      {convert && convert.length > 0 && (
        <DataTable
          columns={convertColumnDef}
          data={convert.map((type) => {
            return {
              format: type,
            };
          })}
        />
      )}
    </Modal>
  );
}

export function ConvertOptions() {
  const { appendConvert } = useOperationStore();
  const [openPop, setPop] = useState(false);
  const [format, setFormat] = useState<TConvertFormatOptions | null>();

  return (
    <div className="flex justify-between">
      <Popover open={openPop} onOpenChange={setPop}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openPop}
            className="w-[200px] justify-between"
          >
            {format ? format.split(":").pop() : "Select format"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search format..." />
            <CommandList>
              <CommandEmpty>No format found.</CommandEmpty>
              <CommandGroup>
                {codecsArray.map((formatValue) => (
                  <CommandItem
                    key={formatValue}
                    value={formatValue}
                    onSelect={(currentValue) => {
                      setFormat(currentValue as TConvertFormatOptions);
                      setPop(false);
                    }}
                    className="text-white"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        format === formatValue ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {formatValue.split(":").pop()}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        disabled={!format}
        onClick={() => {
          if (format) {
            appendConvert(format);
          } else {
            toast.error("Please select a correct video format type");
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
