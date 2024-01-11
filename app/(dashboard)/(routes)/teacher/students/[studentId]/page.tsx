import { clerkClient } from "@clerk/nextjs";
import { PersonalInformationForm } from "./_components/personal-information-form";
import { DeleteUser } from "./_components/delete-user";
import { ChangePasswordModal } from "./_components/change-password-modal";
import { BanUnbanUser } from "./_components/ban-unban-user";

type Props = {
    params: {
        studentId: string;
    };
};

export default async function Page({ params }: Props) {
    const slug = params.studentId;
    const student = await clerkClient.users.getUser(slug);
    const { id, firstName, lastName, banned } = student;

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
                        id={id}
                        firstName={firstName}
                        lastName={lastName}
                    />
                </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 mb-7 flex space-x-6">
                <div className="flex-1">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-2xl font-medium">
                            Security
                        </h3>
                    </div>
                    <div className="p-6 pt-0">
                        <div>Manage security settings</div>
                    </div>
                </div>
                <div className="flex-1 flex justify-end">
                    <ChangePasswordModal id={id} />
                </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 mb-7 flex space-x-6">
                <div className="flex-1">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-2xl font-medium">
                            {banned ? "Unban" : "Ban"} student
                        </h3>
                    </div>
                    <div className="p-6 pt-0">
                        <div>
                            {banned
                                ? "This action restores the ability for a user to sign in"
                                : "This action makes a student unable to sign in and clears all their active sessions"}
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex justify-end">
                    <BanUnbanUser id={id} banned={banned} />
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
                    <DeleteUser id={id} />
                </div>
            </div>
        </div>
    );
}
