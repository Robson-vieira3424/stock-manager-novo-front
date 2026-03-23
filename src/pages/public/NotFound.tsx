import { MapPinOff, Search, LayoutDashboard, ArrowLeft, Wrench, LogIn } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Usuário não logado → manda para o login
  // TECNICO → manda para manutenção
  // ADMIN, ESTOQUISTA, SUPERVISOR → manda para dashboard
  const getDestino = () => {
    if (!isAuthenticated) return { path: "/", label: "Ir ao Login", Icon: LogIn };
    const role = user?.role ?? user?.permissao ?? "";
    if (["ROLE_ADMIN", "ROLE_ESTOQUISTA", "ROLE_SUPERVISOR"].includes(role)) {
      return { path: "/dashboard", label: "Ir ao Dashboard", Icon: LayoutDashboard };
    }
    return { path: "/manutencao", label: "Ir à Manutenção", Icon: Wrench };
  };

  const { path, label, Icon } = getDestino();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 font-sans">

      {/* Ícone */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center">
          <MapPinOff size={44} className="text-blue-500" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">
          <Search size={14} className="text-gray-500" />
        </div>
      </div>

      {/* Código de erro */}
      <h1 className="text-7xl font-bold tracking-tight mb-4">
        <span className="text-blue-600">4</span>
        <span className="text-gray-900">0</span>
        <span className="text-blue-600">4</span>
      </h1>

      {/* Mensagem */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-3">Patrimônio não localizado</h2>
      <p className="text-gray-500 text-center max-w-sm leading-relaxed mb-2">
        A rota{" "}
        <code className="bg-gray-100 text-blue-600 px-1.5 py-0.5 rounded text-sm font-mono">
          {location.pathname}
        </code>{" "}
        não existe no sistema.
      </p>
      <p className="text-gray-500 text-center max-w-sm leading-relaxed mb-8">
        Verifique o endereço ou retorne ao painel principal.
      </p>

      {/* Badge */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 mb-8 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-blue-500" />
        <span className="text-sm font-semibold text-gray-600 tracking-wide uppercase">
          Página não encontrada
        </span>
      </div>

      {/* Botões */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(path)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
        >
          <Icon size={16} />
          {label}
        </button>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 border border-gray-300 hover:bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
      </div>

      {/* Footer */}
      <p className="mt-12 text-xs text-gray-400 flex items-center gap-1">
        <span>🏛️</span> PatrimônioMun
      </p>
    </div>
  );
}