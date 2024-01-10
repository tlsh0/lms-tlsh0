import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import generator from 'generate-password';

export async function POST(
    req: Request,
) {
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
          password: generator.generate({length: 8, numbers: true})
        })

        // Future user profile creation logic
        // const userProfile = await db.userProfile.create({
        //     data: {
        //         userId: user.id,
        //         title,
        //     }
        // });

        return NextResponse.json(user);

    } catch (error) {
        console.log("[STUDENTS]", error)
        console.log(JSON.stringify(error))
        return new NextResponse("Internal Error", { status: 500 });
    }
}