import { Menu } from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

export const MobileSidebar = () => {
    return ( 
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu />
            </SheetTrigger>
            <SheetClose>
                <SheetContent side="left" className="p-0 bg-white">
                    <Sidebar />
                </SheetContent>
            </SheetClose>
        </Sheet>
     );
}