import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import generator from "generate-password";

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const { email, firstName, lastName } = await req.json();

        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await clerkClient.users.createUser({
            emailAddress: [email],
            firstName: firstName,
            lastName: lastName,
            password: generator.generate({ length: 8, numbers: true }),
        });

        if (user) {
            const studentProfile = await db.studentProfile.create({
                data: {
                    id: user.id,
                },
            });

            return NextResponse.json(studentProfile);
        } else {
            throw new Error("Something went wrong");
        }
    } catch (error) {
        console.log("[STUDENTS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
