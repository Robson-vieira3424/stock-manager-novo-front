import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Eye, EyeOff, Monitor, CheckCircle2, KeyRound,
  ArrowLeft, ShieldCheck, Mail, Send, RefreshCw,
} from "lucide-react";

type Step = "email" | "codigo" | "senha" | "sucesso";

function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const levels = [
    { label: "Muito fraca", textColor: "text-red-500" },
    { label: "Fraca",       textColor: "text-orange-500" },
    { label: "Média",       textColor: "text-yellow-500" },
    { label: "Forte",       textColor: "text-green-500" },
    { label: "Muito forte", textColor: "text-green-600" },
  ];
  const barColors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400"];
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {barColors.map((color, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? color : "bg-gray-200"}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${levels[score]?.textColor}`}>{levels[score]?.label}</p>
    </div>
  );
}

function StepIndicator({ stepIndex, variant }: { stepIndex: number; variant: "light" | "dark" }) {
  const stepLabels = ["E-mail", "Código", "Nova senha"];
  const isLight = variant === "light";
  return (
    <div className="flex items-center">
      {stepLabels.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
              i < stepIndex
                ? isLight ? "bg-white border-white text-blue-600" : "bg-blue-600 border-blue-600 text-white"
                : i === stepIndex
                ? isLight ? "bg-white/15 border-white text-white ring-4 ring-white/20" : "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100"
                : isLight ? "bg-transparent border-white/30 text-white/40" : "bg-gray-100 border-gray-100 text-gray-400"
            }`}>
              {i < stepIndex ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-[10px] font-semibold whitespace-nowrap transition-all duration-300 ${
              i <= stepIndex ? (isLight ? "text-white" : "text-blue-600") : (isLight ? "text-white/40" : "text-gray-400")
            }`}>
              {label}
            </span>
          </div>
          {i < stepLabels.length - 1 && (
            <div className={`w-10 sm:w-14 h-0.5 mb-4 mx-1.5 rounded-full transition-all duration-500 ${
              i < stepIndex ? (isLight ? "bg-white" : "bg-blue-600") : (isLight ? "bg-white/20" : "bg-gray-200")
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

function PainelEsquerdo({
  badge, titulo, descricao, items, stepIndex, showProgress,
}: {
  badge: string;
  titulo: React.ReactNode;
  descricao: string;
  items: string[];
  stepIndex: number;
  showProgress: boolean;
}) {
  return (
    <div
      className="hidden lg:flex lg:w-1/2 relative flex-col px-16 xl:px-24 py-16 overflow-hidden"
      style={{ background: "linear-gradient(145deg, #0044AA 0%, #0070E0 50%, #2299FF 100%)" }}
    >
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
      <div className="absolute -bottom-32 -right-16 w-[500px] h-[500px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5 border border-white/20" />

      <div className="relative z-10 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
            <Monitor className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-xl tracking-wide block">TechManager</span>
            <span className="text-blue-200 text-xs font-semibold uppercase tracking-wider">Departamento de Tecnologia</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-lg flex-1">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium mb-6 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {badge}
        </div>
        <h2 className="text-white text-4xl xl:text-5xl font-bold leading-tight mb-6 tracking-tight">{titulo}</h2>
        <p className="text-white/80 text-lg leading-relaxed mb-10 max-w-md">{descricao}</p>
        <div className="space-y-4 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-white/90">
              <CheckCircle2 className="w-5 h-5 text-blue-300 shrink-0" />
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Indicador rodapé — desktop */}
      {showProgress && (
  <div className="relative z-10 mt-auto pt-10">
    
    <div className="flex justify-center">
      <StepIndicator stepIndex={stepIndex} variant="light" />
    </div>
  </div>
)}
    </div>
  );
}

export default function RecuperarSenha() {
  const [step, setStep]                     = useState<Step>("email");
  const [email, setEmail]                   = useState("");
  const [codigo, setCodigo]                 = useState(["", "", "", "", "", ""]);
  const [novaSenha, setNovaSenha]           = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showNova, setShowNova]             = useState(false);
  const [showConfirmar, setShowConfirmar]   = useState(false);
  const [error, setError]                   = useState("");
  const [isLoading, setIsLoading]           = useState(false);
  const [reenvioTimer, setReenvioTimer]     = useState(0);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate  = useNavigate();

  useEffect(() => {
    if (reenvioTimer <= 0) return;
    const t = setTimeout(() => setReenvioTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [reenvioTimer]);

  const handleEnviarEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setIsLoading(true);
    try {
      await api.post("/api/forgot-password", { email });
      setStep("codigo"); setReenvioTimer(60);
    } catch (err: any) {
      setError(err.response?.data?.message || "Falha na conexão com o servidor.");
    } finally { setIsLoading(false); }
  };

  const codigoCompleto = codigo.join("");

  const handleCodigoChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split("");
      const novo  = [...codigo];
      chars.forEach((c, i) => { if (index + i < 6) novo[index + i] = c; });
      setCodigo(novo);
      inputsRef.current[Math.min(index + chars.length, 5)]?.focus();
      return;
    }
    const novo = [...codigo];
    novo[index] = cleaned;
    setCodigo(novo);
    if (cleaned && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleCodigoKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !codigo[index] && index > 0) inputsRef.current[index - 1]?.focus();
  };

  const handleVerificarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (codigoCompleto.length < 6) { setError("Digite todos os 6 dígitos do código."); return; }
    setError(""); setIsLoading(true);
    try {
      await api.post("/api/verify-reset-code", { email, codigo: codigoCompleto });
      setStep("senha");
    } catch (err: any) {
      setError(err.response?.data?.message || "Código inválido ou expirado.");
      setCodigo(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } finally { setIsLoading(false); }
  };

  const handleReenviarCodigo = async () => {
    if (reenvioTimer > 0) return;
    setError("");
    try {
      await api.post("/api/forgot-password", { email });
      setReenvioTimer(60);
      setCodigo(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } catch { setError("Não foi possível reenviar o código."); }
  };

  const handleRedefinirSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) { setError("As senhas não coincidem. Verifique e tente novamente."); return; }
    if (novaSenha.length < 8) { setError("A senha deve ter no mínimo 8 caracteres."); return; }
    setError(""); setIsLoading(true);
    try {
      await api.post("/api/reset-password", { email, codigo: codigoCompleto, novaSenha });
      setStep("sucesso");
    } catch (err: any) {
      setError(err.response?.data?.message || "Não foi possível redefinir a senha.");
    } finally { setIsLoading(false); }
  };

  const painelConfig = {
    email: {
      badge: "Recuperação de Acesso",
      titulo: (<>Recupere seu acesso <br /><span className="text-blue-200">com segurança</span></>),
      descricao: "Informe seu e-mail institucional para receber um código de verificação e redefinir sua senha.",
      items: ["Informe o e-mail cadastrado na plataforma", "Receba um código de 6 dígitos no seu e-mail", "Valide o código para prosseguir com segurança", "Crie uma nova senha e retome o acesso"],
    },
    codigo: {
      badge: "Verificação de Identidade",
      titulo: (<>Confirme sua <br /><span className="text-blue-200">identidade</span></>),
      descricao: "Enviamos um código de 6 dígitos para o seu e-mail. Insira-o para confirmar que é você.",
      items: ["Verifique sua caixa de entrada e spam", "O código é válido por 10 minutos", "Não compartilhe o código com ninguém", "Solicite um novo código se necessário"],
    },
    senha: {
      badge: "Redefinição de Senha",
      titulo: (<>Crie uma senha <br /><span className="text-blue-200">segura e exclusiva</span></>),
      descricao: "Defina uma nova senha forte para proteger o acesso à sua conta no sistema.",
      items: ["Mínimo de 8 caracteres", "Pelo menos uma letra maiúscula", "Pelo menos um número", "Um caractere especial (!@#$...)"],
    },
    sucesso: {
      badge: "Acesso Recuperado",
      titulo: (<>Tudo pronto para <br /><span className="text-blue-200">você acessar</span></>),
      descricao: "Sua senha foi redefinida. Agora é só entrar no sistema com suas novas credenciais.",
      items: ["Senha redefinida com sucesso", "Acesse com suas novas credenciais", "Nunca compartilhe sua senha", "Contate o suporte em caso de problemas"],
    },
  };

  const painel            = painelConfig[step];
  const stepOrder: Step[] = ["email", "codigo", "senha", "sucesso"];
  const stepIndex         = stepOrder.indexOf(step);

  return (
    <div className="min-h-screen flex font-sans" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      <PainelEsquerdo
        badge={painel.badge}
        titulo={painel.titulo}
        descricao={painel.descricao}
        items={painel.items}
        stepIndex={stepIndex}
        showProgress={step !== "sucesso"}
      />

      {/* ── PAINEL DIREITO ── */}
      <div className="flex-1 flex flex-col bg-white relative">

        {/* Topo mobile: banner azul com logo + indicador */}
        <div
          className="lg:hidden flex flex-col px-6 pt-10 pb-6 gap-5"
          style={{ background: "linear-gradient(145deg, #0044AA 0%, #0070E0 60%, #2299FF 100%)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center border border-white/20">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-base block leading-tight">TechManager</span>
              <span className="text-blue-200 text-[10px] font-semibold uppercase tracking-wider">Departamento de TI</span>
            </div>
          </div>

          {/* Indicador mobile */}
          {step !== "sucesso" && (
            <div className="mx-auto">
              <p className="text-white/50 text-[10px] font-semibold uppercase tracking-widest mb-3">Progresso</p>
              <StepIndicator stepIndex={stepIndex} variant="light" />
            </div>
          )}
        </div>

        {/* Botão dark mode — desktop */}
        <div className="hidden lg:block absolute top-6 right-6 z-10">
          <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500 hover:text-gray-700">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
        </div>

        {/* Conteúdo do formulário */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-8 py-10">
          <div className="w-full max-w-sm">

            {error && (
              <div className="mb-5 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* STEP 1 — E-MAIL */}
            {step === "email" && (
              <>
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                    <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                </div>
                <div className="text-center mb-7">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Esqueceu sua senha?</h1>
                  <p className="text-gray-500 text-sm leading-relaxed">Informe o e-mail associado à sua conta. Enviaremos um código de verificação.</p>
                </div>
                <form onSubmit={handleEnviarEmail} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail cadastrado</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all text-sm bg-gray-50 focus:bg-white placeholder:text-gray-400"
                        placeholder="exemplo@gmail.com" required />
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading}
                    className={` hover:cursor-pointer w-full py-2.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${isLoading ? "bg-blue-400 cursor-not-allowed shadow-none" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98]"}`}>
                    {isLoading ? (<><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" /></svg>Enviando...</>) : (<><Send className="w-4 h-4 " />Enviar código de verificação</>)}
                  </button>
                </form>
              </>
            )}

            {/* STEP 2 — CÓDIGO */}
            {step === "codigo" && (
              <>
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                    <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                </div>
                <div className="text-center mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Verifique seu e-mail</h1>
                  <p className="text-gray-500 text-sm leading-relaxed">Enviamos um código de 6 dígitos para</p>
                  <p className="text-blue-600 font-semibold text-sm mt-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 inline-block break-all">{email}</p>
                </div>
                <form onSubmit={handleVerificarCodigo} className="mt-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Digite o código recebido</label>
                    <div className="flex gap-1.5 sm:gap-2 justify-center">
                      {codigo.map((digit, i) => (
                        <input key={i} ref={(el) => { inputsRef.current[i] = el; }}
                          type="text" inputMode="numeric" maxLength={6} value={digit}
                          onChange={(e) => handleCodigoChange(i, e.target.value)}
                          onKeyDown={(e) => handleCodigoKeyDown(i, e)}
                          className={`w-10 sm:w-11 text-center text-base sm:text-lg font-bold border rounded-xl outline-none transition-all duration-200 bg-gray-50 focus:bg-white ${digit ? "border-blue-400 bg-blue-50 text-blue-700 focus:ring-2 focus:ring-blue-500/20" : "border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"}`}
                          style={{ height: "48px" }} />
                      ))}
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading || codigoCompleto.length < 6}
                    className={`w-full py-2.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${isLoading || codigoCompleto.length < 6 ? "bg-blue-400 cursor-not-allowed shadow-none" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98]"}`}>
                    {isLoading ? (<><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" /></svg>Verificando...</>) : (<><ShieldCheck className="w-4 h-4" />Verificar código</>)}
                  </button>
                </form>
                <div className="mt-5 text-center">
                  <p className="text-gray-500 text-xs mb-2">Não recebeu o código?</p>
                  <button onClick={handleReenviarCodigo} disabled={reenvioTimer > 0}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${reenvioTimer > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"}`}>
                    <RefreshCw className="w-3.5 h-3.5" />
                    {reenvioTimer > 0 ? `Reenviar em ${reenvioTimer}s` : "Reenviar código"}
                  </button>
                </div>
                <button onClick={() => { setStep("email"); setError(""); setCodigo(["","","","","",""]); }}
                  className="w-full mt-3 py-2.5 rounded-xl text-gray-600 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:bg-gray-50 hover:text-gray-800">
                  <ArrowLeft className="w-4 h-4" />Usar outro e-mail
                </button>
              </>
            )}

            {/* STEP 3 — NOVA SENHA */}
            {step === "senha" && (
              <>
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                    <KeyRound className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                </div>
                <div className="text-center mb-7">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Crie uma nova senha</h1>
                  <p className="text-gray-500 text-sm leading-relaxed">Sua identidade foi confirmada. Defina uma senha segura para sua conta.</p>
                </div>
                <form onSubmit={handleRedefinirSenha} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nova senha</label>
                    <div className="relative">
                      <input type={showNova ? "text" : "password"} value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)}
                        className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all text-sm bg-gray-50 focus:bg-white placeholder:text-gray-400"
                        placeholder="••••••••" required />
                      <button type="button" onClick={() => setShowNova(!showNova)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1">
                        {showNova ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <PasswordStrengthBar password={novaSenha} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar nova senha</label>
                    <div className="relative">
                      <input type={showConfirmar ? "text" : "password"} value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)}
                        className={`w-full px-4 py-2.5 pr-11 border rounded-xl focus:ring-2 outline-none transition-all text-sm bg-gray-50 focus:bg-white placeholder:text-gray-400 ${confirmarSenha && novaSenha !== confirmarSenha ? "border-red-300 focus:ring-red-500/20 focus:border-red-400" : confirmarSenha && novaSenha === confirmarSenha ? "border-green-300 focus:ring-green-500/20 focus:border-green-400" : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-600"}`}
                        placeholder="••••••••" required />
                      <button type="button" onClick={() => setShowConfirmar(!showConfirmar)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1">
                        {showConfirmar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmarSenha && novaSenha !== confirmarSenha && <p className="mt-1.5 text-xs text-red-500 font-medium">As senhas não coincidem.</p>}
                    {confirmarSenha && novaSenha === confirmarSenha && <p className="mt-1.5 text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />Senhas coincidem.</p>}
                  </div>
                  <button type="submit" disabled={isLoading}
                    className={`w-full py-2.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${isLoading ? "bg-blue-400 cursor-not-allowed shadow-none" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98]"}`}>
                    {isLoading ? (<><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" /></svg>Redefinindo...</>) : (<><ShieldCheck className="w-4 h-4" />Redefinir senha</>)}
                  </button>
                </form>
              </>
            )}

            {/* STEP 4 — SUCESSO */}
            {step === "sucesso" && (
              <div className="text-center">
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-green-50 flex items-center justify-center border border-green-100">
                    <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
                  </div>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Senha redefinida!</h1>
                <p className="text-gray-500 text-sm leading-relaxed mb-7">Sua senha foi alterada com sucesso. Você já pode acessar o sistema com suas novas credenciais.</p>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-7 text-left">
                  <p className="text-blue-700 text-xs font-medium mb-1">🔒 Dica de segurança</p>
                  <p className="text-blue-600 text-xs leading-relaxed">Nunca compartilhe sua senha com terceiros. Caso suspeite de acessos não autorizados, contate o suporte de TI imediatamente.</p>
                </div>
                <button onClick={() => navigate("/")}
                  className="w-full py-2.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98]">
                  <KeyRound className="w-4 h-4" />Ir para o Login
                </button>
              </div>
            )}

            {(step === "email" || step === "senha") && (
              <button onClick={() => navigate("/")}
                className="w-full hover:cursor-pointer mt-3 py-2.5 rounded-xl text-gray-600 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:bg-gray-50 hover:text-gray-800">
                <ArrowLeft className="w-4 h-4" />Voltar para o Login
              </button>
            )}

            <div className="mt-8 pt-5 border-t border-gray-100">
              <p className="text-center text-xs text-gray-400">
                © {new Date().getFullYear()} Departamento de Tecnologia da Informação.<br />Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}