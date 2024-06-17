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
    accessorKey: "bookingFrom",
    header: "Date From",
  },
  {
    accessorKey: "bookingTo",
    header: "Date To",
  },
  {
    accessorKey: "totalAmount",
    header: "Total (US$)",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];