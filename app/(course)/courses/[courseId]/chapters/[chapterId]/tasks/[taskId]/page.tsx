import { redirect } from "next/navigation";
import { db } from "@/lib/db";


const ChapterIdPage = async ({
    params,
}: {
    params: { courseId: string; chapterId: string; }
}) => {
    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
            courseId: params.courseId,
        },
        include: {
            tasks: {
                where: {
                    isPublished: true,
                },
                orderBy: {
                    position: "asc",
                }
            }
        }
    });

    if (!chapter) {
        return redirect("/");
    }

    return redirect(`/courses/${chapter.courseId}/chapters/${chapter.id}/tasks/${chapter.tasks[0].id}`);

}
 
export default ChapterIdPage;