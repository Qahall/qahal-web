import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  onSetOrderBy: (orderBy: string) => void;
  onSetOrderDir: (orderDir: string) => void;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  onSetOrderBy,
  onSetOrderDir,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div
            className="
      -ml-3 h-8 inline-flex items-center justify-center gap-2 
      rounded-md px-2 text-sm font-medium 
      transition-colors select-none
      hover:bg-accent hover:text-accent-foreground
      data-[state=open]:bg-accent hover:cursor-pointer
    "
          >
            <span>{title}</span>

            {column.getIsSorted() === "desc" ? (
              <ArrowDown size={15} />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp size={15} />
            ) : (
              <ChevronsUpDown size={15} />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => {
              onSetOrderBy(column.id);
              onSetOrderDir("asc");
            }}
          >
            <ArrowUp />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              onSetOrderBy(column.id);
              onSetOrderDir("desc");
            }}
          >
            <ArrowDown />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff />
            Hide
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
