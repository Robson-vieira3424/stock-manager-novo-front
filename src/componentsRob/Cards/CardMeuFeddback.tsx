import { useEffect, useState } from "react";
import api from "@/services/api"
import { AlertCircle, Badge, CheckCircle2, ChevronRight, Clock, Loader2, MessageSquarePlus, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FeedbackItem {
    id: number;
    titulo: string;
    descricao: string;
    categoria: string;
    prioridade: string;
    status: string;           // ex: "PENDENTE", "EM_ANALISE", "CONCLUIDO", "REJEITADO"
    imagemBase64?: string;
    imagemTipo?: string;
    imagemNome?: string;
    usuarioId: number;
}

// ─── Helpers de estilo ────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    PENDENTE: { label: "Pendente", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: <Clock className="w-3 h-3" /> },
    EM_ANALISE: { label: "Em análise", color: "bg-blue-100 text-blue-800 border-blue-200", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    CONCLUIDO: { label: "Concluído", color: "bg-green-100 text-green-800 border-green-200", icon: <CheckCircle2 className="w-3 h-3" /> },
    REJEITADO: { label: "Rejeitado", color: "bg-red-100 text-red-800 border-red-200", icon: <XCircle className="w-3 h-3" /> },
};

const prioridadeConfig: Record<string, string> = {
    BAIXA: "bg-slate-100 text-slate-600",
    MEDIA: "bg-orange-100 text-orange-700",
    ALTA: "bg-red-100 text-red-700",
    URGENTE: "bg-red-200 text-red-800 font-semibold",
};

const categoriaLabel: Record<string, string> = {
    SUGESTAO: "Sugestão",
    BUG: "Erro / Bug",
    MELHORIA: "Melhoria",
    OUTRO: "Outro",
};

export default function MeusFeedbacks() {
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(false);
    const [expandido, setExpandido] = useState<number | null>(null);

    useEffect(() => {
        api.get("/feedbacks")
            .then((res) => {
                // Filtra só os do usuário logado — adapte conforme sua lógica de auth
                const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
                const meus = res.data.filter((f: FeedbackItem) => f.usuarioId === userData?.id);
                setFeedbacks(meus);
            })
            .catch(() => setErro(true))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-[#0080FF]" />
                <span className="text-sm">Carregando seus feedbacks...</span>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                <AlertCircle className="w-8 h-8 text-red-400" />
                <span className="text-sm">Não foi possível carregar os feedbacks.</span>
            </div>
        );
    }

    if (feedbacks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                <MessageSquarePlus className="w-10 h-10 opacity-30" />
                <p className="text-sm font-medium">Você ainda não enviou nenhum feedback.</p>
                <p className="text-xs opacity-70">Use a aba "Novo Feedback" para enviar o primeiro!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {feedbacks.map((fb) => {
                const status = statusConfig[fb.status] ?? statusConfig["PENDENTE"];
                const aberto = expandido === fb.id;

                return (
                    <Card
                        key={fb.id}
                        className="cursor-pointer transition-shadow hover:shadow-md"
                        onClick={() => setExpandido(aberto ? null : fb.id)}
                    >
                        <CardHeader className="pb-2">
                            {/* Linha superior: título + status */}
                            <div className="flex items-start justify-between gap-3">
                                <CardTitle className="text-base font-semibold leading-snug">
                                    {fb.titulo}
                                </CardTitle>
                                <Badge
                                    variant="outline"
                                    className={`flex items-center gap-1 shrink-0 text-xs px-2 py-0.5 ${status.color}`}
                                >
                                    {status.icon}
                                    {status.label}
                                </Badge>
                            </div>

                            {/* Linha inferior: categoria + prioridade + seta */}
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs font-normal">
                                    {categoriaLabel[fb.categoria] ?? fb.categoria}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={`text-xs font-normal ${prioridadeConfig[fb.prioridade] ?? ""}`}
                                >
                                    {fb.prioridade.charAt(0) + fb.prioridade.slice(1).toLowerCase()}
                                </Badge>
                                <ChevronRight
                                    className={`w-4 h-4 ml-auto text-muted-foreground transition-transform duration-200 ${aberto ? "rotate-90" : ""}`}
                                />
                            </div>
                        </CardHeader>

                        {/* Detalhes expansíveis */}
                        {aberto && (
                            <CardContent className="pt-0 space-y-3 border-t mt-2">
                                <CardDescription className="text-sm text-foreground/80 pt-3 whitespace-pre-wrap">
                                    {fb.descricao}
                                </CardDescription>

                                {/* Imagem anexada, se houver */}
                                {fb.imagemBase64 && (
                                    <div className="rounded-lg overflow-hidden border border-muted">
                                        <img
                                            src={`data:${fb.imagemTipo};base64,${fb.imagemBase64}`}
                                            alt="Captura de tela anexada"
                                            className="w-full max-h-64 object-contain bg-muted/20"
                                        />
                                        {fb.imagemNome && (
                                            <p className="text-xs text-muted-foreground px-3 py-1 bg-muted/30">
                                                {fb.imagemNome}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}