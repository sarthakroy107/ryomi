import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFileDelete } from "@/hooks/use-delete";
import { useFileDownload } from "@/hooks/use-download";
import { formatBytes } from "@/lib/helpers/byte-formatter.helper";
import { formatDate } from "@/lib/helpers/date-formatter";
import { TFileTaskOperations } from "@/lib/zod/genral-purpose/base-schemas.zod";
import { ColumnDef } from "@tanstack/react-table";
import { Download, MoreHorizontal, Trash2 } from "lucide-react";

export const transcodeFileColumnDef: ColumnDef<TFileTaskOperations>[] = [
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
  },
  {
    id: "resolution",
    header: "Resolution",
    cell: ({ row }) => {
      const name = row.original.s3_key.split("-").pop()?.split(".")[0];
      return (
        <span className="dark:bg-white/5 p-1 px-2.5 rounded-[2px]">
          {name}p
        </span>
      ); // This should work fine now.
    },
  },
  {
    id: "format",
    header: "Format",
    cell: ({ row }) => {
      return (
        <span className="dark:bg-white/5 p-1 px-2.5 rounded-[2px]">
          {row.original.s3_key.split(".").pop()}
        </span>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      if (row.original.size === null) return <span></span>;
      return <span>{formatBytes(row.original.size)}</span>;
    },
  },
  {
    accessorKey: "saveTill",
    header: "Available",
    cell: ({ row }) => {
      return <span>{formatDate(row.original.saveTill)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === "complete"
              ? "default"
              : status === "in-progress"
              ? "secondary"
              : "destructive"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: ({ table }) => {
      const selectedFiles = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original.id);

      const { mutate: mutateDownlaod, isPending: isDownlaodPending } =
        useFileDownload();
      const { mutate: mutateDelete, isPending: isDeletePending } =
        useFileDelete();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              disabled={isDownlaodPending}
              onClick={() => mutateDownlaod(selectedFiles)}
            >
              {" "}
              <Download /> Download (
              {table.getFilteredSelectedRowModel().rows.length})
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isDeletePending}
              onClick={() => mutateDelete(selectedFiles)}
              className="text-red-500/80 hover:dark:text-red-500/100 hover:dark:bg-red-400/25"
            >
              {" "}
              <Trash2 /> Delete (
              {table.getFilteredSelectedRowModel().rows.length})
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    cell: ({ cell, table }) => {
      const { mutate: muateDownload, isPending: isDownloadPending } =
        useFileDownload();
      const { mutate: mutateDelete, isPending: isDeletePending } =
        useFileDelete();
      const status = cell.row.original.status;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              disabled={isDownloadPending || status !== "complete"}
              onClick={() => muateDownload([cell.row.original.id])}
            >
              {" "}
              <Download /> Download
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isDeletePending}
              onClick={() => mutateDelete([cell.row.original.id])}
              className="text-red-500/80 hover:dark:text-red-500/100 hover:dark:bg-red-400/25"
            >
              {" "}
              <Trash2 /> {isDeletePending ? "Deleting" : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const convertFileColumnDef: ColumnDef<TFileTaskOperations>[] = [
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
  },
  {
    id: "format",
    header: "Format",
    cell: ({ row }) => {
      return (
        <span className="dark:bg-white/5 p-1 px-2.5 rounded-[2px]">
          {row.original.s3_key.split(".").pop()}
        </span>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      if (row.original.size === null) return <span></span>;
      return <span>{formatBytes(row.original.size)}</span>;
    },
  },
  {
    accessorKey: "saveTill",
    header: "Available",
    cell: ({ row }) => {
      return <span>{formatDate(row.original.saveTill)}</span>;
    },
  },
  {
    id: "actions",
    header: ({ table }) => {
      const selectedFiles = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original.id);

      const { mutate: mutateDownlaod, isPending: isDownlaodPending } =
        useFileDownload();
      const { mutate: mutateDelete, isPending: isDeletePending } =
        useFileDelete();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              disabled={isDownlaodPending}
              onClick={() => mutateDownlaod(selectedFiles)}
              className="cursor-pointer"
            >
              {" "}
              <Download /> Download (
              {table.getFilteredSelectedRowModel().rows.length})
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isDeletePending}
              onClick={() => mutateDelete(selectedFiles)}
              className="text-red-500/80 hover:dark:text-red-500/100 hover:dark:bg-red-400/25 cursor-pointer"
            >
              {" "}
              <Trash2 /> Delete (
              {table.getFilteredSelectedRowModel().rows.length})
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    cell: ({ cell }) => {
      const { mutate: mutateDownload, isPending: isDownloadPending } =
        useFileDownload();
      const { mutate: mutateDelete, isPending: isDeletePending } =
        useFileDelete();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer"
              disabled={isDownloadPending}
              onClick={() => mutateDownload([cell.row.original.id])}
            >
              {" "}
              <Download /> Download
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isDeletePending}
              onClick={() => mutateDelete([cell.row.original.id])}
              className="text-red-500/80 hover:dark:text-red-500/100 hover:dark:bg-red-400/25 cursor-pointer"
            >
              {" "}
              <Trash2 /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const subtitleFileColumnDef: ColumnDef<TFileTaskOperations>[] = [
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
  },
  {
    id: "language",
    header: "Language",
    cell: ({ row }) => {
      const name = row.original.s3_key.split("-").pop()?.split(".")[0];
      return (
        <span className="dark:bg-white/5 p-1 px-2.5 rounded-[2px]">{name}</span>
      );
    },
  },
  {
    id: "format",
    header: "Format",
    cell: ({ row }) => {
      return (
        <span className="dark:bg-white/5 p-1 px-2.5 rounded-[2px]">
          {row.original.s3_key.split(".").pop()}
        </span>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      if (row.original.size === null) return <span></span>;
      return <span>{formatBytes(row.original.size)}</span>;
    },
  },
  {
    accessorKey: "saveTill",
    header: "Available",
    cell: ({ row }) => {
      return <span>{formatDate(row.original.saveTill)}</span>;
    },
  },
  {
    id: "actions",
    header: ({ table }) => {
      const selectedFiles = table
        .getFilteredRowModel()
        .rows.map((row) => row.original.id);
      const { mutate: mutateDonwload, isPending: isDownloadPending } =
        useFileDownload();
      const { mutate: mutateDelete, isPending: isDeletePending } =
        useFileDelete();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              disabled={isDownloadPending}
              onClick={() => mutateDonwload(selectedFiles)}
              className="cursor-pointer"
            >
              {" "}
              <Download /> Download (
              {table.getFilteredSelectedRowModel().rows.length})
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isDeletePending}
              onClick={() => mutateDelete(selectedFiles)}
              className="text-red-500/80 hover:dark:text-red-500/100 hover:dark:bg-red-400/25 cursor-pointer"
            >
              {" "}
              <Trash2 /> Delete (
              {table.getFilteredSelectedRowModel().rows.length})
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    cell: ({ cell }) => {
      const { mutate: mutateDownload, isPending: isDownloadPending } =
        useFileDownload();
      const { mutate: mutateDelete, isPending: isDeletePending } =
        useFileDelete();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              disabled={isDownloadPending}
              onClick={() => mutateDownload([cell.row.original.id])}
              className="cursor-pointer"
            >
              {" "}
              <Download /> Download
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isDeletePending}
              onClick={() => mutateDelete([cell.row.original.id])}
              className="text-red-500/80 hover:dark:text-red-500/100 hover:dark:bg-red-400/25 cursor-pointer"
            >
              {" "}
              <Trash2 /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
