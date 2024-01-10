import React from "react";
import { Sidebar } from "./_components/sidebar";
import { Navbar } from "./_components/navbar";

const DashboardLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return ( 
        <div className="h-full">
            <div className="h-[80px] max-[680px]:pl-0 fixed inset-y-0 w-full z-50">
                <Navbar />
            </div>
            <div className="min-[640px]:flex max-[680px]:hidden h-full w-56 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </div>
            <main className="min-[640px]:pl-56 max-[680px]:pl-0 pt-[80px] h-full">
                {children}
            </main>
        </div>
     );
}
 
export default DashboardLayout;