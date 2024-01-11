import axios from "axios";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { studentId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const studentId = params.studentId;
        const response = await axios.post(
            `https://api.clerk.com/v1/users/${studentId}/unban`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
                },
            }
        );

        return NextResponse.json(response.data);
    } catch (error) {
        console.log("[STUDENT_ID_UNBAN]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
