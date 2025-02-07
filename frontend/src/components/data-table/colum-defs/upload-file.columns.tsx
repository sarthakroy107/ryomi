import { Checkbox } from "@/components/ui/checkbox";
import { formatBytes } from "@/lib/helpers/byte-formatter.helper";
import { ColumnDef } from "@tanstack/react-table";

export const uploadFileColumns: ColumnDef<File>[] = [
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
    accessorKey: "name",
    header: "File name",
    cell: ({ row }) => {
      const name: string = row.getValue("name");
      return <span>{name}</span>;
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      const size: number = row.getValue("size");
      return <span>{formatBytes(size)}</span>;
    },
  }
];
