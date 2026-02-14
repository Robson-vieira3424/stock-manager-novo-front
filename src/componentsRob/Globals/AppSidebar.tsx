import { Link, useLocation } from "react-router-dom";
import {
  Sidebar, 
  SidebarContent,

  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { ArrowLeftRight, Box, LayoutDashboard, MapPinned, Monitor, Package, Wrench,  } from "lucide-react"; // Removido 'Sidebar' daqui
export default function AppSidebar() {
  const menuItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Estoque", url: "/produtos", icon: Package },
    { title: "Movimentações", url: "/movimentacoes", icon: ArrowLeftRight  },
    { title: "Computadores", url: "/computadores", icon: Monitor },
    { title: "Manutenção", url: "/manutencao", icon: Wrench  },
    { title: "Mapeamento", url: "/mapeamento", icon: MapPinned  },
  ] 

  const location = useLocation(); 
  const pathname = location.pathname;
  return (
    <>
      <Sidebar>
  <SidebarContent className="flex flex-col h-full">

    {/* HEADER */}
    <div className="p-4 border-b">
      <div className="flex items-center gap-3">
        <Box className="w-12 h-12 text-[#ffffff]  rounded-xl bg-[#0080FF] p-2.5 border " />
        <div>
          <p className="font-bold text-gray-900 text-[16px]">
            Gestão Patrimonial
          </p>
          <p className="text-[13px] text-gray-500">
            Penedo - AL
          </p>
        </div>
      </div>
    </div>

    {/* MENU */}
    <div className="flex-1 pt-4">
      <SidebarMenu>
        {menuItems.map((item) => {
          const isActive = pathname === item.url;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className="
                  hover:bg-gray-200 hover:data-[active=true]:text-black
                  data-[active=true]:bg-[#0080FF]
                  data-[active=true]:text-white
                  data-[active=true]:font-normal
                  transition-colors
                "
              >
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </div>

  </SidebarContent>
</Sidebar>

    </>);
}