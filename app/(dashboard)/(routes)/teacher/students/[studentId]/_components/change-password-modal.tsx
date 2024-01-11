"use client";

import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
    FormItem,
} from "@/components/ui/form";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { User } from "@clerk/nextjs/server";
import { useState } from "react";
import toast from "react-hot-toast";
import { ClerkError } from "@/lib/clerk-error";

type Props = {
    id: User["id"];
};

const formSchema = z
    .object({
        newPassword: z.string().min(8, {
            message: "Password must be at least 8 characters",
        }),
        passwordMathcer: z.string().min(8, {
            message: "Password must be at least 8 characters",
        }),
    })
    .superRefine(({ newPassword, passwordMathcer }, ctx) => {
        if (newPassword !== passwordMathcer) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
            });
        }
    });

export function ChangePasswordModal({ id }: Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: "",
            passwordMathcer: "",
        },
    });
    const [isOpen, setIsOpen] = useState(false);

    const { isSubmitting, isValid, errors } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/students/${id}/password`, values);
            form.reset();
            setIsOpen(false);
            toast.success("Password has been succefully updated");
        } catch (error) {
            if (
                error instanceof AxiosError &&
                error.code === AxiosError.ERR_BAD_REQUEST
            ) {
                const errors: ClerkError["errors"] = error.response?.data;
                errors.map((item) => {
                    form.setError("root", { message: item.message });
                });
            }

            toast.error("Something went wrong");
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button className="mt-6">Change Password</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Change Password</AlertDialogTitle>
                    <AlertDialogDescription>
                        Passwords must contain 8 or more characters.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Form {...form}>
                    <form
                        className="space-y-6 mt-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New password</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="passwordMathcer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm new password</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {errors.root?.message && (
                            <p className="text-sm font-medium text-destructive">
                                {errors.root.message}
                            </p>
                        )}

                        <div className="flex justify-end space-x-2">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                            >
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
