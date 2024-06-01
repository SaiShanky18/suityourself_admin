"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<OrderColumnType>[] = [
  {
    accessorKey: "_id",
    header: "Order",
    cell: ({ row }) => {
      return (
        <Link
          href={`/orders/${row.original._id}`}
          className="hover:text-red-1"
        >
          {row.original._id}
        </Link>
      );
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "Booking",
    header: "Dates Reserved",
  },
  {
    accessorKey: "totalAmount",
    header: "Total (TT$)",
  },
  {
    accessorKey: "createdAt",
    header: "Created At (dd/mm/yyyy)",
  },
];