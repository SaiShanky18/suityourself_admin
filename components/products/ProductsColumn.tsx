"use client"

import { ColumnDef } from "@tanstack/react-table"
import Delete from "../custom ui/Delete"
import Link from "next/link"


export const columns: ColumnDef<ProductType>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (<Link href={`/products/${row.original._id}`} className="hover:text-red-1"><p>{row.original.title}</p></Link>)
    },
    {
        accessorKey: "category",
        header: "Category",
        
    },
    {
        accessorKey: "collection",
        header: "Collection",
        cell: ({row}) => row.original.collections.map((collection) => collection.title).join(", ")
    },
    {
        accessorKey: "price",
        header: "Rental Price (TT$)",
        
    },
    {
        accessorKey: "expense",
        header: "Expense (TT$)",
        
    },
    {
        id: "actions",
        cell: ({ row }) => <Delete item="product" id={row.original._id} />,
    },
]
