"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface TaskActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    taskId: string;
    isPublished: boolean;

};

export const TaskActions = ({
    disabled,
    courseId,
    chapterId,
    taskId,
    isPublished,
} : TaskActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading ] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/tasks/${taskId}/unpublish`);
                toast.success("Task unpublished");
            } else {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/tasks/${taskId}/publish`);
                toast.success("Task published");
            }

            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);

            //await axios.delete...
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}/tasks/${taskId}`);

            toast.success("Task deleted");
            router.refresh();
            router.push(`/teacher/courses/${courseId}/chapters/${chapterId}`);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}