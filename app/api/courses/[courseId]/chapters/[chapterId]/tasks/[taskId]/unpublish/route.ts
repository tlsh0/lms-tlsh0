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

        const unpublishedTask = await db.task.update({
            where: {
                id: params.taskId,
                chapterId: params.chapterId,
            },
            data: {
                isPublished: false,
            }
        });

        return NextResponse.json(unpublishedTask);

    } catch (error) {
        console.log("[CHAPTER_UNPUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}