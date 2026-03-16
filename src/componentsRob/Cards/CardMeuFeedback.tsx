import { useEffect, useState } from "react";
import api from "@/services/api";
import {
    AlertCircle, Bug, CheckCircle2, Clock,
    Lightbulb, Loader2, MessageSquarePlus,
    X, XCircle, ImageIcon, TriangleAlert
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface FeedbackItem {
    id: number;
    titulo: string;
    descricao: string;
    categoria: string;
    prioridade: string;
    status: string;
    dataCriacao?: string;
    respostaEquipe?: string;
    imagemBase64?: string;
    imagemTipo?: string;
    imagemNome?: string;
    usuarioId: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    PENDENTE: { label: "Pendente", color: "bg-white text-gray-700 border-gray-300", icon: <Clock className="w-3 h-3" /> },
    EM_ANALISE: { label: "Em Análise", color: "bg-blue-100 text-blue-800 border-blue-200", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    EM_PROGRESSO: { label: "Em Progresso", color: "bg-purple-100 text-purple-800 border-purple-200", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    CONCLUIDO: { label: "Concluído", color: "bg-green-100 text-green-800 border-green-200", icon: <CheckCircle2 className="w-3 h-3" /> },
    REJEITADO: { label: "Rejeitado", color: "bg-red-100 text-red-800 border-red-200", icon: <XCircle className="w-3 h-3" /> },
};

const prioridadeConfig: Record<string, string> = {
    BAIXA: "bg-slate-100 text-slate-600 border-slate-200",
    MEDIA: "bg-orange-100 text-orange-700 border-orange-200",
    ALTA: "bg-[#0080FF] text-white border-[#0080FF]",
    URGENTE: "bg-red-600 text-white border-red-600 font-semibold",
};

const categoriaLabel: Record<string, string> = {
    SUGESTAO: "Sugestão",
    CORRECAO: "Erro/Bug",
};

const categoriaIcon: Record<string, React.ReactNode> = {
    SUGESTAO: <Lightbulb className="w-4 h-4 text-yellow-500" />,
    CORRECAO: <Bug className="w-4 h-4 text-blue-400" />,
};

function formatarData(dataISO?: string) {
    if (!dataISO) return "";
    return new Date(dataISO).toLocaleString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function FeedbackModal({ fb, onClose }: { fb: FeedbackItem; onClose: () => void }) {
    const status = statusConfig[fb.status] ?? statusConfig["PENDENTE"];

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            {/* Painel */}
            <div
                className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Botão fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-full border border-gray-200 p-1.5 hover:bg-gray-100 transition-colors"
                >
                    <X className="w-4 h-4 text-gray-500" />
                </button>

                <div className="p-6 space-y-4">

                    {/* Título + ícone */}
                    <div className="flex items-center gap-2 pr-8">
                        {categoriaIcon[fb.categoria] ?? <MessageSquarePlus className="w-5 h-5 text-muted-foreground" />}
                        <h2 className="text-lg font-bold leading-snug">{fb.titulo}</h2>
                    </div>

                    {/* Subtítulo: categoria • data */}
                    <p className="text-sm text-muted-foreground -mt-2">
                        {categoriaLabel[fb.categoria] ?? fb.categoria}
                        {fb.dataCriacao && (
                            <> • Enviado em {formatarData(fb.dataCriacao)}</>
                        )}
                    </p>

                    {/* Badges status + prioridade */}
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className={`flex items-center gap-1 text-xs px-3 py-1 ${status.color}`}
                        >
                            {status.icon}
                            {status.label}
                        </Badge>
                        <Badge
                            variant="outline"
                            className={`text-xs px-3 py-1 ${prioridadeConfig[fb.prioridade] ?? ""}`}
                        >
                            Prioridade: {fb.prioridade.charAt(0) + fb.prioridade.slice(1).toLowerCase()}
                        </Badge>
                    </div>

                    {/* Descrição */}
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-[#0080FF]">Descrição</p>
                        <p className="text-sm text-foreground/80 whitespace-pre-wrap">{fb.descricao}</p>
                    </div>

                    {/* Imagem */}
                    {fb.imagemBase64 && (
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-[#0080FF] flex items-center gap-1">
                                <ImageIcon className="w-4 h-4" /> Imagem Anexada
                            </p>
                            <div className="rounded-lg overflow-hidden border border-muted">
                                <img
                                    src={`data:${fb.imagemTipo};base64,${fb.imagemBase64}`}
                                    alt="Captura de tela"
                                    className="w-full max-h-64 object-contain bg-muted/20"
                                />
                            </div>
                        </div>
                    )}

                    {/* Resposta da equipe OU aviso de aguardando */}
                    {fb.respostaEquipe ? (
                        <div className="bg-muted/40 rounded-lg border px-4 py-3 space-y-0.5">
                            <p className="text-xs font-semibold text-muted-foreground">Resposta da Equipe:</p>
                            <p className="text-sm text-foreground/80">{fb.respostaEquipe}</p>
                        </div>
                    ) : (
                        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                            <TriangleAlert className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground">
                                Seu feedback está aguardando análise. Você receberá uma notificação quando houver atualizações.
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default function MeusFeedbacks() {
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(false);
    const [selecionado, setSelecionado] = useState<FeedbackItem | null>(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
        const usuarioId = userData?.id;

        if (!usuarioId) {
            setErro(true);
            setLoading(false);
            return;
        }

        api.get(`/feedbacks/usuario/${usuarioId}`)
            .then((res) => setFeedbacks(res.data))
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
        <>
            <div className="space-y-3">
                {feedbacks.map((fb) => {
                    const status = statusConfig[fb.status] ?? statusConfig["PENDENTE"];

                    return (
                        <Card
                            key={fb.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => setSelecionado(fb)}
                        >
                            <CardContent className="flex items-start gap-4 px-5 py-4">

                                {/* Ícone */}
                                <div className="mt-0.5 shrink-0">
                                    {categoriaIcon[fb.categoria] ?? <MessageSquarePlus className="w-4 h-4 text-muted-foreground" />}
                                </div>

                                {/* Texto */}
                                <div className="flex-1 min-w-0 space-y-1">
                                    <p className="font-semibold text-sm leading-snug">{fb.titulo}</p>
                                    <p className="text-sm text-muted-foreground truncate">{fb.descricao}</p>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground pt-0.5">
                                        <Clock className="w-3 h-3" />
                                        <span>{formatarData(fb.dataCriacao)}</span>
                                    </div>
                                </div>

                                {/* Badges */}
                                <div className="flex flex-col items-end gap-1.5 shrink-0">
                                    <Badge variant="outline" className={`flex items-center gap-1 text-xs px-2 py-0.5 ${status.color}`}>
                                        {status.icon}
                                        {status.label}
                                    </Badge>
                                    <Badge variant="outline" className={`text-xs px-2 py-0.5 ${prioridadeConfig[fb.prioridade] ?? ""}`}>
                                        {fb.prioridade.charAt(0) + fb.prioridade.slice(1).toLowerCase()}
                                    </Badge>
                                </div>

                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Modal */}
            {selecionado && (
                <FeedbackModal fb={selecionado} onClose={() => setSelecionado(null)} />
            )}
        </>
    );
}