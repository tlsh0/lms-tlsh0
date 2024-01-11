"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Student = {
    id: string;
    fullName: string | undefined;
    emailAddress: string;
    isSubscriber: boolean;
};

export const columns: ColumnDef<Student>[] = [
    {
        accessorKey: "fullName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Full Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const { fullName, id } = row.original;
            return (
                <Link href={`/teacher/students/${id}`} className="underline">
                    {fullName}
                </Link>
            );
        },
    },
    {
        accessorKey: "isSubscriber",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Subscriber
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const isSubscriber = row.getValue("isSubscriber") || false;

            return (
                <Badge
                    className={cn("bg-slate-500", isSubscriber && "bg-sky-700")}
                >
                    {isSubscriber ? "Paid" : "Not Paid"}
                </Badge>
            );
        },
    },
];
