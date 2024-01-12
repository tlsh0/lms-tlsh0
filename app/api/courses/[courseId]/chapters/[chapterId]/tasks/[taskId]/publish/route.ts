import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string; taskId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const task = await db.task.findUnique({
            where: {
                id: params.taskId,
                chapterId: params.chapterId,
            }
        });

        const muxData = await db.muxData.findUnique({
            where: {
                taskId: params.taskId,
            }
        });

        if (!task || !task.title) {
            return new NextResponse("Missing required fileds", { status: 400 });
        }

        const publishedTask = await db.task.update({
            where: {
                id: params.taskId,
                chapterId: params.chapterId,
            },
            data: {
                isPublished: true,
            }
        });

        return NextResponse.json(publishedTask);

    } catch (error) {
        console.log("[CHAPTER_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}