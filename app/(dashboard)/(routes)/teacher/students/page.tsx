import { clerkClient } from "@clerk/nextjs";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { db } from "@/lib/db";

type Props = {};

export default async function Page({}: Props) {
    const studentProfiles = await db.studentProfile.findMany();
    const studentProfileIds = studentProfiles.map((student) => student.id);

    const studentUsers = await clerkClient.users.getUserList({
        userId: studentProfileIds,
    });

    const tableData = studentUsers.map((user) => {
        const emailAddress = user.emailAddresses[0].emailAddress;

        return {
            id: user.id,
            fullName: user.firstName + " " + user.lastName,
            emailAddress: emailAddress,
            isSubscriber: false,
        };
    });

    return (
        <div className="p-6">
            <DataTable columns={columns} data={tableData} />
        </div>
    );
}
