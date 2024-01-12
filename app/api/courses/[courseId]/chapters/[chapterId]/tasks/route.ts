import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params } : { params: { chapterId: string, courseId: string } }
) {
    try {
        const { userId } = auth();
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const lastTask = await db.task.findFirst({
            where: {
                chapterId: params.chapterId,
            },
            orderBy: {
                position: "desc",
            },
        });

        const newPosition = lastTask ? lastTask.position + 1 : 1;

        const task = await db.task.create({
            data: {
                title,
                chapterId: params.chapterId,
                position: newPosition,
            },
        });

        return NextResponse.json(task);

    } catch (error) {
        console.log("[TASKS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}