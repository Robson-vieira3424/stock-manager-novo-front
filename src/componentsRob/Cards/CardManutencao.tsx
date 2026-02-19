import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LuMonitor } from "react-icons/lu";
import { AlertTriangle, User, Calendar, Eye, Pencil } from "lucide-react";
import { manutecaoDTO } from "@/types/manutencaoDTO";

interface CardProps {
    data: manutecaoDTO;
    onView?: (id: number) => void;
    onEdit?: (id: number) => void;
}

// Pequena função auxiliar para cor do status (opcional, pode ajustar conforme seus status reais)
const getStatusColor = (status: string) => {
    const s = status?.toUpperCase();
    if (s === 'CONCLUIDO' || s === 'FINALIZADO') return 'bg-green-100 text-green-700 border-green-200';
    if (s === 'CANCELADO') return 'bg-gray-100 text-gray-600 border-gray-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200'; // Padrão (Pendente/Em andamento)
};

export default function CardManutencao({ data, onView, onEdit }: CardProps) {
    return (
        <Card className="w-full mb-2 hover:bg-slate-50 transition-colors py-0 border-l-4 border-l-blue-500 shadow-sm">
            <CardContent className="flex flex-col md:flex-row items-start md:items-center p-2 gap-4">

                {/* --- SEÇÃO 1: Computador (Esquerda) --- */}
                <div className="flex items-center gap-4 min-w-[200px] border-r md:border-r-0 md:border-gray-100 pr-4 md:pr-0">
                    <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-gray-400 shrink-0">
                        <LuMonitor size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-[14px] leading-none mb-1">
                            {data.pc?.nome || "PC Desconhecido"}
                        </h3>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                            <span>PAT: {data.pc?.patrimonio || "N/A"}</span>
                            <span>{data.pc?.localizacao}</span>
                        </div>
                    </div>
                </div>

                {/* --- SEÇÃO 2: Conteúdo Central (Problema + Técnico) --- */}
                <div className="flex flex-1 flex-col md:flex-row md:items-center justify-start gap-6 md:pl-4">

                    {/* Bloco do Problema e Prioridade */}
                    <div className="flex flex-col gap-2 min-w-[250px]">
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={16} className="text-orange-500 shrink-0" />
                            <span className="font-medium text-sm line-clamp-1" title={data.descricaoProblema}>
                                {data.descricaoProblema}
                            </span>
                        </div>

                        {/* Apenas a Prioridade fica aqui agora */}
                        <div className="flex gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide
                                ${data.prioridade === 'ALTA' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                {data.prioridade}
                            </span>
                        </div>
                    </div>

                    {/* Bloco Técnico e Data */}
                    <div className="flex md:flex-col gap-3 md:gap-1 text-sm text-slate-600 border-t md:border-t-0 pt-2 md:pt-0 mt-2 md:mt-0">
                        <div className="flex items-center gap-2" title="Técnico Responsável">
                            <User size={14} className="text-slate-400" />
                            <span className="text-xs font-medium">{data.tecnicoId}</span>
                        </div>
                        <div className="flex items-center gap-2" title="Previsão de Entrega">
                            <Calendar size={14} className="text-slate-400" />
                            <span className="text-xs">
                                {data.dataPrevisao ? new Date(data.dataPrevisao).toLocaleDateString() : '--/--/--'}
                            </span>
                        </div>
                    </div>

                </div>
                <span className={`ml-2 px-3 py-1 rounded-md text-xs font-bold uppercase border ${getStatusColor(data.status)}`}>
                    {data.status}
                </span>
                <div className="flex items-center gap-2 self-end md:self-center mt-2 md:mt-0 pl-2 md:pl-0 md:border-l md:border-gray-100 md:ml-2">

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() => onView && onView(data.id || 0)}
                        title="Visualizar Detalhes"
                    >
                        <Eye size={16} />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-amber-600 border-amber-200 hover:bg-amber-50"
                        onClick={() => onEdit && onEdit(data.id || 0)}
                        title="Editar / Atualizar"
                    >
                        <Pencil size={16} />
                    </Button>

                    {/* STATUS AGORA ESTÁ AQUI NA DIREITA */}
                   

                </div>

            </CardContent>
        </Card>
    );
}