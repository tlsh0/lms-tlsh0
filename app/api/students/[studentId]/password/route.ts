import { isClerkError } from "@/lib/clerk-error";
import { isTeacher } from "@/lib/teacher";
import { auth, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { studentId: string } }
) {
    try {
        const { userId } = auth();
        const { newPassword } = await req.json();

        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const x = await clerkClient.users.updateUser(params.studentId, {
            password: newPassword,
        });

        return NextResponse.json(null);
    } catch (error) {
        console.log("[STUDENT_ID_PASSWORD]", error);
        if (isClerkError(error)) {
            return new NextResponse(JSON.stringify(error.errors), {
                status: 400,
            });
        }

        return new NextResponse("Internal Error", { status: 500 });
    }
}
