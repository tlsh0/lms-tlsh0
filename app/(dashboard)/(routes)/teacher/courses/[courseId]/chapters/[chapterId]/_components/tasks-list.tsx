"use client";

import { Task } from "@prisma/client";
import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";

import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"

interface TasksListProps {
    items: Task[];
    onReorder: (updateData: { id: string; chapterId: string | null; position: number; }[]) => void;
    onEdit: (id: string) => void;
};

export const TasksList = ({
    items,
    onReorder,
    onEdit,
}: TasksListProps) => {
    const [isMounted, setIsMouted] = useState(false);
    const [tasks, setTasks] = useState(items);

    useEffect(() => {
        setIsMouted(true);
    }, []);

    useEffect(() => {
        setTasks(items);
    }, [items]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(tasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);

        const updatedTasks = items.slice(startIndex, endIndex + 1);

        setTasks(items);

        const bulkUpdateData = updatedTasks.map((task) => ({
            id: task.id,
            chapterId: task.chapterId,
            position: items.findIndex((item) => item.id === task.id)
        }));

        onReorder(bulkUpdateData);
    }

    if (!isMounted) {
        return null;
    }

    return ( 
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="tasks">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {tasks.map((task,index) => (
                            <Draggable
                                key={task.id}
                                draggableId={task.id}
                                index={index}
                            >
                                {(provided) => (
                                    <div
                                        className={cn(
                                            "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                                            task.isPublished && "bg-red-100 border-red-200 text-red-700"
                                        )}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                    >
                                        <div
                                            className={cn(
                                                "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                                task.isPublished && "border-r-red-200 hover:bg-red-200"
                                            )}
                                            {...provided.dragHandleProps}
                                        >
                                            <Grip 
                                                className="h-5 w-5"
                                            />
                                        </div>
                                        {task.title}
                                        <div className="ml-auto pr-2 flex items-center gap-x-2">
                                        {task.isFree && (
                                            <Badge>
                                                Free
                                            </Badge>
                                        )}
                                        <Badge
                                            className={cn(
                                                "bg-slate-500",
                                                task.isPublished && "bg-red-700"
                                            )}
                                        >
                                            {task.isPublished ? "Published" : "Draft"}
                                        </Badge>
                                        <Pencil 
                                            onClick={() => onEdit(task.id)}
                                            className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                                        />
                                    </div>
                                </div>
                            )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
     )
}