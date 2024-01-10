import { clerkClient } from "@clerk/nextjs";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

type Props = {};


export default async function Page({}: Props) {
  const users = await clerkClient.users.getUserList();

  const students = users.map((user) => {
    const emailAddress = user.emailAddresses[0].emailAddress

    return {
      id: user.id,
      fullName: user.firstName + ' ' + user.lastName,
      emailAddress: emailAddress,
      isSubscriber: false
    }
  })

  
  return <div className="p-6"><DataTable columns={columns} data={students} /></div>;
}
