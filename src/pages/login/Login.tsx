import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Eye, EyeOff, LogIn, Monitor } from "lucide-react";

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
    <div className="min-h-screen flex font-sans" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── PAINEL ESQUERDO ── */}
      <div
        className="hidden lg:flex lg:w-[45%] relative flex-col justify-center p-12 overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0055CC 0%, #0080FF 45%, #33A3FF 100%)",
        }}
      >
        {/* Círculos decorativos de fundo */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
        <div className="absolute -bottom-32 -right-16 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />

        {/* Logo topo */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold text-lg tracking-wide">Gestão Patrimonial</span>
          </div>
        </div>

        {/* Texto principal */}
        <div className="relative z-10">
          <h2 className="text-white text-4xl font-bold leading-tight mb-4">
            Controle total do<br />patrimônio público
          </h2>
          <p className="text-white/75 text-base leading-relaxed max-w-xs">
            Gerencie computadores, equipamentos, manutenções e estoque de peças em um único lugar — com rastreabilidade completa.
          </p>
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

          {/* Logo mobile (só aparece em telas menores) */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-800 text-lg">Gestão Patrimonial</span>
          </div>

          {/* Logo desktop */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <Monitor className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="text-gray-900">Patrimônio</span>
              <span className="text-blue-600">Mun</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Gestão Patrimonial Municipal</p>
          </div>

          {/* Erro */}
          {error && (
            <div className="mb-5 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm text-center border border-red-100 flex items-center gap-2 justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Campo E-mail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                E-mail Institucional
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm bg-gray-50 focus:bg-white placeholder:text-gray-400"
                placeholder="nome@prefeitura.gov.br"
                required
              />
            </div>

            {/* Campo Senha */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <a href="#" className="text-xs text-blue-600 hover:text-blue-700 hover:underline">
                  Esqueci minha senha
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm bg-gray-50 focus:bg-white placeholder:text-gray-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Lembrar-me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="lembrar"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
              />
              <label htmlFor="lembrar" className="text-sm text-gray-600 cursor-pointer select-none">
                Lembrar-me
              </label>
            </div>

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-full py-2.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md mt-2
                ${isLoggingIn
                  ? "bg-blue-400 cursor-not-allowed shadow-none"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98]"
                }`}
            >
              {isLoggingIn ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                  </svg>
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Entrar no Sistema
                </>
              )}
            </button>
          </form>

          {/* Ajuda */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-3">Precisa de ajuda?</p>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Suporte
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
                Manual
              </button>
            </div>
          </div>

          {/* Rodapé */}
          <p className="text-center text-xs text-gray-400 mt-8">
            © {new Date().getFullYear()} Prefeitura Municipal. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}