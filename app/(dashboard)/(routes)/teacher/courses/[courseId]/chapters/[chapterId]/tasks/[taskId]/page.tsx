import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Banner } from "@/components/banner";
import { TaskActions } from "./_components/task-actions";
import { TaskTitleForm } from "./_components/task-title-form";
import { TaskDescriptionForm } from "./_components/task-description-form";
import { TaskVideoForm } from "./_components/chapter-video-form";
import { TaskQuizForm } from "./_components/task-quiz-form";

const TaskIdPage = async ({
    params
}: {
    params: { courseId: string; chapterId: string; taskId: string }
}) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const task = await db.task.findUnique({
        where: {
            id: params.taskId,
            chapterId: params.chapterId
        },
        include: {
            muxData: true,
        },
    });

    if (!task) {
        return redirect("/");
    }

    const requiredFields = [
        task.title,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    
    const completionText = `(${completedFields} out of ${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return ( 
        <>
            {!task.isPublished && (
                <Banner 
                    variant="warning"
                    label="This task is unpublished. It will not be visible in the course"
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/teacher/courses/${params.courseId}/chapters/${params.chapterId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to chapter setup
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Task Creation
                                </h1>
                                <span className="text-sm text-slate-700">
                                    Complete all fields {completionText}
                                </span>
                            </div>
                            <TaskActions 
                                disabled={!isComplete}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                                taskId={params.taskId}
                                isPublished={task.isPublished}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">
                                    Customize your chapter
                                </h2>
                            </div>
                            <TaskTitleForm 
                                initialData={task}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                                taskId={params.taskId}
                            />
                            <TaskDescriptionForm 
                                initialData={task}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                                taskId={params.taskId}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Video} />
                            <h2 className="text-xl">
                                Add a quiz
                            </h2>
                        </div>
                        <TaskQuizForm
                            initialData={task}
                            chapterId={params.chapterId}
                            courseId={params.courseId}
                            taskId={params.taskId}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Video} />
                            <h2 className="text-xl">
                                Add a video
                            </h2>
                        </div>
                        <TaskVideoForm 
                            initialData={task}
                            chapterId={params.chapterId}
                            courseId={params.courseId}
                            taskId={params.taskId}
                        />
                    </div>
                </div>
            </div>
        </>
     );
}
 
export default TaskIdPage;