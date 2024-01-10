"use client";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
    FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@clerk/nextjs/server";
import { useRouter } from "next/navigation";

type Props = {
    id: User["id"];
    firstName: User["firstName"];
    lastName: User["lastName"];
};

const formSchema = z.object({
    firstName: z.string().min(1, {
        message: "First Name is required",
    }),
    lastName: z.string().min(1, {
        message: "Last Name is required",
    }),
});

export function PersonalInformationForm({ id, firstName, lastName }: Props) {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: firstName || "",
            lastName: lastName || "",
        },
    });
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const updatedUser = await axios.patch(
                `/api/students/${id}`,
                values
            );
            router.refresh();
            toast.success("Student has been succefully updated");
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 mt-8"
            >
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isSubmitting}
                                    placeholder="John"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isSubmitting}
                                    placeholder="Doe"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center gap-x-2 justify-end">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => form.reset()}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!isValid || isSubmitting}>
                        Update
                    </Button>
                </div>
            </form>
        </Form>
    );
}
