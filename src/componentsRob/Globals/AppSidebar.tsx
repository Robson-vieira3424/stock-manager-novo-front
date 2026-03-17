import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { ArrowLeftRight, Box, LayoutDashboard, LogOut, MapPinned, MessageSquarePlus, Monitor, Package, Settings, User, UserCircle, Wrench } from "lucide-react";
import { usePermissao } from "@/hooks/usePermission";
import { useNavigate } from "react-router-dom";

const roleLabel: Record<string, string> = {
  ROLE_ADMIN: "Administrador",
  ROLE_ESTOQUISTA: "Estoquista",
  ROLE_TECNICO: "Técnico",
  ROLE_SUPERVISOR: "Supervisor",
};

export default function AppSidebar() {
  const { isAdmin, isEstoquista, isTecnico, permissao } = usePermissao();
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("user_data") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user_data");
    localStorage.removeItem("token");
    navigate("/");
  };

  const menuItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, visivel: true },
    { title: "Mapeamento", url: "/mapeamento", icon: MapPinned, visivel: isAdmin },
    { title: "Feedback", url: "/feedbacks", icon: MessageSquarePlus, visivel: true },
    { title: "Estoque", url: "/produtos", icon: Package, visivel: isAdmin || isEstoquista },
    { title: "Movimentações", url: "/movimentacoes", icon: ArrowLeftRight, visivel: isAdmin || isEstoquista },
    { title: "Computadores", url: "/computadores", icon: Monitor, visivel: isAdmin || isTecnico },
    { title: "Manutenção", url: "/manutencao", icon: Wrench, visivel: isAdmin || isTecnico },
    { title: "Configurações", url: "/configuracoes", icon: Settings, visivel: isAdmin },
  ].filter((item) => item.visivel);

  return (
    <Sidebar>
  <SidebarContent className="flex flex-col h-full">

        {/* HEADER */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Box className="w-12 h-12 text-white rounded-xl bg-[#0080FF] p-2.5 border" />
            <div>
              <p className="font-bold text-gray-900 text-[16px]">Gestão Patrimonial</p>
              <p className="text-[13px] text-gray-500">Penedo - AL</p>
            </div>
          </div>
        </div>

        {/* MENU */}
        <div className="flex-1 pt-4">
          <SidebarMenu className="px-2.5">
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

      
        {/* FOOTER */}
        <div className="border-t p-4 space-y-3">

          {/* Info do usuário */}
          <div className="flex items-center gap-2.5">
            <div className="shrink-0 w-8 h-8 rounded-full bg-[#0080FF]/10 flex items-center justify-center">
              <User className="w-5 h-5 text-[#0080FF]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userData?.email ?? "—"}
              </p>
              <p className="text-xs text-gray-500">
                {roleLabel[permissao] ?? permissao}
              </p>
            </div>
          </div>

          {/* Botão sair */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center hover:cursor-pointer gap-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg py-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>

        </div>

      </SidebarContent>
    </Sidebar>
  );
}