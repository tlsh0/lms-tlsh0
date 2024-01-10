"use client";

import axios from "axios";
import toast from "react-hot-toast";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { User } from "@clerk/nextjs/server";
import { useRouter } from "next/navigation";

type Props = {
    id: User["id"];
};

export function DeleteUser({ id }: Props) {
    const router = useRouter();
    async function handleConfirm() {
        try {
            const deletedUser = await axios.delete(`/api/students/${id}`);
            router.push("/teacher/students");
            router.refresh();
            toast.success("Student has been succefully deleted");
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    return (
        <ConfirmModal onConfirm={handleConfirm}>
            <Button className="mt-6" variant="destructive">
                Delete
            </Button>
        </ConfirmModal>
    );
}
