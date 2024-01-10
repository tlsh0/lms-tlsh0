import { clerkClient } from "@clerk/nextjs";
import { PersonalInformationForm } from "./_components/personal-information-form";
import { DeleteUser } from "./_components/delete-user";

type Props = {
    params: {
        studentId: string;
    };
};

export default async function Page({ params }: Props) {
    const slug = params.studentId;
    const student = await clerkClient.users.getUser(slug);

    return (
        <div className="p-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 mb-7 flex space-x-6">
                <div className="flex-1">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-2xl font-medium">
                            Personal information
                        </h3>
                    </div>
                    <div className="p-6 pt-0">
                        <div>Manage personal information settings</div>
                    </div>
                </div>
                <div className="flex-1">
                    <PersonalInformationForm
                        id={student.id}
                        firstName={student.firstName}
                        lastName={student.lastName}
                    />
                </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 mb-7 flex space-x-6">
                <div className="flex-1">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-2xl font-medium">
                            Delete student
                        </h3>
                    </div>
                    <div className="p-6 pt-0">
                        <div>This action is permanent and cannot be undone</div>
                    </div>
                </div>
                <div className="flex-1 flex justify-end">
                    <DeleteUser id={student.id} />
                </div>
            </div>
        </div>
    );
}
