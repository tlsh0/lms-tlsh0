import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!,
)

export async function DELETE(
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
                id: params.chapterId,
                chapterId: params.chapterId,
            }
         });

         if (!task) {
            return new NextResponse("Not found", { status: 404 });
         }

         if (task.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    taskId: params.taskId,
                }
            });

            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                });
            }
         }

         const deletedTask = await db.task.delete({
            where: {
                id: params.taskId
            }
         });

         return NextResponse.json(deletedTask);
    } catch (error) {
        console.log("[TASK_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string; taskId: string } }
) {
    try {
        const { userId } = auth();
        const { isPublished, ...values } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId, //MAYBE JUST userId. without the second one.
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const task = await db.task.update({
            where: {
                id: params.taskId,
                chapterId: params.chapterId,
            },
            data: {
                ...values,
            }
        });

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    taskId: params.taskId,
                }
            });

            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                });
            }

            const asset = await Video.Assets.create({
                input: values.videoUrl,
                playback_policy: "public",
                test: false,
            });

            await db.muxData.create({
                data: {
                    chapterId: params.chapterId,
                    taskId: params.taskId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id,
                }
            });
        }

        return NextResponse.json(task);

    } catch (error) {
        console.log("[COURSES_CHAPTER_ID]", error);
        return new NextResponse("Internal Error", { status : 500 });
    }
}