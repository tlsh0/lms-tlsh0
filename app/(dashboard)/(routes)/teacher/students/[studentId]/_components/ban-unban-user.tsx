"use client";

import axios from "axios";
import toast from "react-hot-toast";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { User } from "@clerk/nextjs/server";
import { useRouter } from "next/navigation";

type Props = {
    id: User["id"];
    banned: User["banned"];
};

export function BanUnbanUser({ id, banned }: Props) {
    const router = useRouter();

    async function banStudent() {
        try {
            const banned = await axios.post(`/api/students/${id}/ban`);
            router.push(`/teacher/students/${id}`);
            router.refresh();
            toast.success("Student has been succefully banned");
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    async function unbanStudent() {
        try {
            const unbanned = await axios.post(`/api/students/${id}/unban`);
            router.push(`/teacher/students/${id}`);
            router.refresh();
            toast.success("Student has been succefully unbanned");
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    return banned ? (
        <ConfirmModal
            onConfirm={unbanStudent}
            title="Unban student"
            description="Are you sure you want to unban this user?
            This action is not permanent and can be undone."
        >
            <Button className="mt-6" variant="success">
                Unban student
            </Button>
        </ConfirmModal>
    ) : (
        <ConfirmModal
            onConfirm={banStudent}
            title="Ban user"
            description="Are you sure you want to ban this user?
            This action is not permanent and can be undone."
        >
            <Button className="mt-6" variant="destructive">
                Ban student
            </Button>
        </ConfirmModal>
    );
}
