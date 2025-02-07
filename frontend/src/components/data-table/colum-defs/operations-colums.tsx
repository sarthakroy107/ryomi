import { Button } from "@/components/ui/button";
import { nllb200Languages } from "@/lib/data/languges";
import {
  TConvertFormatOptions,
  TNLLB200LanguageCodes,
  TOperationSchema,
  TScalingOptions,
} from "@/lib/zod/operation-validator";
import { useOperationStore } from "@/lib/zustand/operation-store";
import { ColumnDef } from "@tanstack/react-table";
import { X } from "lucide-react";

export const transcodeColumnDef: ColumnDef<TOperationSchema["transcode"][0]>[] =
  [
    {
      id: "serial",
      header: "Serial",
      cell: ({ row }) => {
        return <span>{row.index + 1}.</span>;
      },
    },
    {
      accessorKey: "scale",
      header: "Scale",
      cell: ({ row }) => {
        const scale: string = row.getValue("scale");
        return <span>{scale.split(":").pop()}</span>;
      },
    },
    {
      accessorKey: "format",
      header: "Format",
      cell: ({ row }) => {
        const format: string = row.getValue("format");
        return (
          <span className="dark:bg-white/10 rounded-[4px] dark:text-white/85 p-1 px-1.5">
            .{format}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Remove",
      cell: ({ row }) => {
        const { removeTranscode } = useOperationStore();
        return (
          <Button
            onClick={() => {
              const scale: TScalingOptions = row.getValue("scale");
              const format: TConvertFormatOptions = row.getValue("format");
              if (scale && format) {
                removeTranscode({ scale, format });
              }
            }}
            variant={"outline"}
            className="group rounded-full h-8 w-8"
          >
            <X size={3} className="group-hover:text-red-500" />
          </Button>
        );
      },
    },
  ];

export const convertColumnDef: ColumnDef<{
  format: TConvertFormatOptions;
}>[] = [
  {
    id: "serial",
    header: "Serial",
    cell: ({ row }) => {
      return <span>{row.index + 1}.</span>;
    },
  },
  {
    accessorKey: "format",
    header: "Format",
    cell: ({ row }) => {
      const format: string = row.getValue("format");
      return (
        <span className="dark:bg-white/10 rounded-[4px] dark:text-white/85 p-1 px-1.5">
          .{format}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Remove",
    cell: ({ row }) => {
      const { removeConvert } = useOperationStore();
      return (
        <Button
          onClick={() => {
            const format: TConvertFormatOptions = row.getValue("format");
            if (format) {
              removeConvert(format);
            }
          }}
          variant={"outline"}
          className="group rounded-full h-8 w-8"
        >
          <X size={3} className="group-hover:text-red-500" />
        </Button>
      );
    },
  },
];

export const subtitleColumnDef: ColumnDef<{
  language: TNLLB200LanguageCodes;
}>[] = [
  {
    id: "serial",
    header: "Serial",
    cell: ({ row }) => {
      return <span>{row.index + 1}.</span>;
    },
  },
  {
    accessorKey: "language",
    header: "Format",
    cell: ({ row }) => {
      const language: string = row.getValue("language");
      return (
        <span className="dark:bg-white/10 rounded-[4px] dark:text-white/85 p-1 px-1.5">
          {nllb200Languages.find((lang) => lang.code === language)?.name}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Remove",
    cell: ({ row }) => {
      const { removeSubtitleLang } = useOperationStore();
      return (
        <Button
          onClick={() => {
            const language: TNLLB200LanguageCodes = row.getValue("language");
            if (language) {
              removeSubtitleLang(language);
            }
          }}
          variant={"outline"}
          className="group rounded-full h-8 w-8"
        >
          <X size={3} className="group-hover:text-red-500" />
        </Button>
      );
    },
  },
];
