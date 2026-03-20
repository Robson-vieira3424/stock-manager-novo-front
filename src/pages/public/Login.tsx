import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Eye, EyeOff, LogIn, Monitor, CheckCircle2 } from "lucide-react"; // Adicionei CheckCircle2

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);
    try {
      const response = await api.post("/login", { email, senha });
      const data = response.data;
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Acesso negado.");
      } else {
        setError("Falha na conexão com o servidor.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div
      className="min-h-screen flex font-sans"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      {/* ── PAINEL ESQUERDO (REDESIGN CORPORATIVO) ── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-center px-16 xl:px-24 overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, #0044AA 0%, #0070E0 50%, #2299FF 100%)",
        }}
      >
        {/* Círculos decorativos de fundo */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #fff 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-32 -right-16 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #fff 0%, transparent 70%)",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5 border border-white/20" />

        {/* Badge e Logo Topo */}
        <div className="relative z-10 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <Monitor className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-xl tracking-wide block">
                TechManager
              </span>
              <span className="text-blue-200 text-xs font-semibold uppercase tracking-wider">
                Departamento de Tecnologia
              </span>
            </div>
          </div>
        </div>

        {/* Texto principal e Features */}
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Sistema de Gestão Integrada
          </div>

          <h2 className="text-white text-4xl xl:text-5xl font-bold leading-tight mb-6 tracking-tight">
            Gestão inteligente dos <br />
            <span className="text-blue-200">ativos de TI municipais</span>
          </h2>

          <p className="text-white/80 text-lg leading-relaxed mb-10 max-w-md">
            Centralize o controle de equipamentos, rastreie manutenções,
            gerencie o estoque de peças e tome decisões baseadas em dados.
          </p>

          {/* Lista de Features com Glassmorphism */}
          <div className="space-y-4 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 text-white/90">
              <CheckCircle2 className="w-5 h-5 text-blue-300 shrink-0" />
              <span className="font-medium">
                Controle de computadores e equipamentos
              </span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <CheckCircle2 className="w-5 h-5 text-blue-300 shrink-0" />
              <span className="font-medium">
                Gestão de chamados e manutenções técnicas
              </span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <CheckCircle2 className="w-5 h-5 text-blue-300 shrink-0" />
              <span className="font-medium">
                Movimentações de estoque com rastreabilidade total
              </span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <CheckCircle2 className="w-5 h-5 text-blue-300 shrink-0" />
              <span className="font-medium">
                Dashboards com indicadores operacionais (KPIs)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── PAINEL DIREITO ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white px-8 py-12 relative">
        {/* Botão modo escuro canto superior */}
        <div className="absolute top-6 right-6">
          <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500 hover:text-gray-700">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
        </div>

        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-800 text-lg">
              GovIT Manager
            </span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Acesse sua conta
            </h1>
            <p className="text-gray-500 text-sm">
              Insira suas credenciais para acessar o sistema.
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm text-center border border-red-100 flex items-center gap-2 justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4 shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all text-sm bg-gray-50 focus:bg-white placeholder:text-gray-400"
                placeholder="nome@prefeitura.gov.br"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/resetpassword")}
                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors cursor-pointer"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all text-sm bg-gray-50 focus:bg-white placeholder:text-gray-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-full py-2.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md mt-4 ${
                isLoggingIn
                  ? "bg-blue-400 cursor-not-allowed shadow-none"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98]"
              }`}
            >
              {isLoggingIn ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray="30 70"
                    />
                  </svg>
                  Autenticando...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Entrar na Plataforma
                </>
              )}
            </button>
          </form>

          {/* Rodapé */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400">
              © {new Date().getFullYear()} Departamento de Tecnologia da
              Informação.
              <br />
              Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
