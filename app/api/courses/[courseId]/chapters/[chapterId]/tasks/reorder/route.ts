import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { list } = await req.json();
        
        for (let item of list) {
            await db.task.update({
                where: { 
                    id: item.id,
                    chapterId: item.chapterId,
                }, 
                data: { position: item.position },
            });
        }

        return new NextResponse("Success", { status: 200 });

    } catch (error) {
        console.log("[REORDER_TASKS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}