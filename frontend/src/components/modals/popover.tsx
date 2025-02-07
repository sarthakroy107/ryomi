import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import React, { SetStateAction, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
export function GenericPopover<T extends string | number | null | undefined>({
  initialOpen,
  setVal,
  currentVal,
  title,
  data,
}: {
  initialOpen: boolean;
  data: {
    name: string;
    value: T;
  }[];
  setVal: (data: T) => void;
  currentVal: T;
  title: string;
}) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {currentVal
            ? data.find((item) => item.value === currentVal)?.name
            : title}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.name as string}
                  onSelect={(currentValue) => {
                    setVal(
                      data.find((item) => item.name === currentValue)?.value as T
                    );
                    setOpen(false);
                  }}
                  className="text-white"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentVal === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
