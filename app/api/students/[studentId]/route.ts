import { isTeacher } from "@/lib/teacher";
import { auth, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { studentId: string } }
) {
    try {
        const { userId } = auth();
        const { studentId } = params;
        const values = await req.json();

        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const updatedUser = await clerkClient.users.updateUser(studentId, {
            ...values,
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.log("[STUDENT_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { studentId: string } }
) {
    try {
        const { userId } = auth();
        const { studentId } = params;

        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const deletedUser = await clerkClient.users.deleteUser(studentId);

        return NextResponse.json(deletedUser);
    } catch (error) {
        console.log("[STUDENT_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
