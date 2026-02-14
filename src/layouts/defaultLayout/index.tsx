import { Outlet } from "react-router-dom";
import HeaderGlobal from "@/componentsRob/Globals/HeaderGlobal";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/componentsRob/Globals/AppSidebar";

export default function DefaultLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset> 
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
          <SidebarTrigger className="-ml-1" />
          <HeaderGlobal />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};