import { ShieldOff, Lock, LayoutDashboard, ArrowLeft, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AcessoNegado() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // TECNICO não pode ver o dashboard — redireciona para manutenção
  const podeVerDashboard = ["ROLE_ADMIN", "ROLE_ESTOQUISTA", "ROLE_SUPERVISOR"].includes(
    user?.role ?? user?.permissao ?? ""
  );

  const destino = podeVerDashboard ? "/dashboard" : "/manutencao";
  const labelDestino = podeVerDashboard ? "Ir ao Dashboard" : "Ir à Manutenção";
  const IconeDestino = podeVerDashboard ? LayoutDashboard : Wrench;

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 font-sans">

      {/* Ícone */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center">
          <ShieldOff size={44} className="text-blue-500" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">
          <Lock size={14} className="text-gray-500" />
        </div>
      </div>

      {/* Código de erro */}
      <h1 className="text-7xl font-bold tracking-tight mb-4">
        <span className="text-blue-600">4</span>
        <span className="text-gray-900">0</span>
        <span className="text-blue-600">3</span>
      </h1>

      {/* Mensagem */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-3">Acesso restrito</h2>
      <p className="text-gray-500 text-center max-w-sm leading-relaxed mb-2">
        Você não possui permissão para acessar este recurso.
      </p>
      <p className="text-gray-500 text-center max-w-sm leading-relaxed mb-8">
        Caso acredite que deveria ter acesso, entre em contato com o administrador do sistema.
      </p>

      {/* Badge */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 mb-8 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-blue-500" />
        <span className="text-sm font-semibold text-gray-600 tracking-wide uppercase">
          Permissão Insuficiente
        </span>
      </div>

      {/* Botões */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(destino)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
        >
          <IconeDestino size={16} />
          {labelDestino}
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