"use client";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { formatBytes } from "@/lib/helpers/byte-formatter.helper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const operationsSchema = z.object({
  id: z.string(),
  uploadTableId: z.string(),
  key: z.string(),
  saveTill: z.string(),
  createdAt: z.string(),
  size: z.number(),
});

export type Operations = z.infer<typeof operationsSchema>;

export const operationsColumn: ColumnDef<Operations>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="rounded-none"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        className="rounded-none"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "key",
    header: "File name",
    cell: ({ row }) => {
      const fileKey: string = row.getValue("key");
      return <span>{fileKey}</span>;
    },
  },
  {
    accessorKey: "size",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Size
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const size: number = row.getValue("size");
      return <span>{formatBytes(size)}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const  createdAt: string = row.getValue("createdAt");
      return <span>  {createdAt}</span>;
    },
  },
  {
    accessorKey: "saveTill",
    header: "Save till",
    cell: ({ row }) => {
      const saveTill: string = row.getValue("saveTill");
      return <span>{saveTill}</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(data.id)}
            >
              Copy file ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Originasl file</DropdownMenuItem>
            <DropdownMenuItem>Download</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];


//Dummy data
export const operationsData: Operations[] = [
  {
    id: "1",
    uploadTableId: "1",
    key: "file1.mp4",
    saveTill: "2022-04-01",
    createdAt: "2022-03-01",
    size: 1024,
  },
  {
    id: "2",
    uploadTableId: "2",
    key: "file2.mp4",
    saveTill: "2022-04-01",
    createdAt: "2022-03-01",
    size: 2048,
  },
  {
    id: "3",
    uploadTableId: "3",
    key: "file3.mp4",
    saveTill: "2022-04-01",
    createdAt: "2022-03-01",
    size: 4096,
  },
  {
    id: "4",
    uploadTableId: "4",
    key: "file4.mp4",
    saveTill: "2022-04-01",
    createdAt: "2022-03-01",
    size: 8192,
  },
  {
    id: "5",
    uploadTableId: "5",
    key: "file5.mp4",
    saveTill: "2022-04-01",
    createdAt: "2022-03-01",
    size: 16384,
  },
  {
    id: "6",
    uploadTableId: "6",
    key: "file6.mp4",
    saveTill: "2022-04-01",
    createdAt: "2022-03-01",
    size: 32768,
  },
  {
    id: "7",
    uploadTableId: "7",
    key: "file7.mp4",
    saveTill: "2022-04-01",
    createdAt: "2022-03-01",
    size: 65536,
  },
  {
    id: "8",
    uploadTableId: "8",
    key: "file8.mp4",
    saveTill: "2022-04-01",
    createdAt: "2022-03-01",
    size: 131072,
  },
  {
    id: "9",
    uploadTableId: "9",
    key: "file9.mp4",
    saveTill: "2022-04-01",
    createdAt: "2022-03-01",
    size: 262144,
  },
  {
    id: "10",
    uploadTableId: "10",
    key: "file10.mp4",
    saveTill: "2022-04-01",
    createdAt: "2022-03-01",
    size: 524288,
  },
];