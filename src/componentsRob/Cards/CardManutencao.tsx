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

const getStatusColor = (status: string) => {
    const s = status?.toUpperCase();
    if (s === 'CONCLUIDO' || s === 'FINALIZADO') return 'bg-green-100 text-green-700 border-green-200';
    if (s === 'CANCELADO') return 'bg-gray-100 text-gray-600 border-gray-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
};

export default function CardManutencao({ data, onView, onEdit }: CardProps) {
    return (
        <Card className="w-full p-0 mb-3 hover:bg-slate-50 transition-all border-l-4 border-l-blue-500 shadow-sm overflow-hidden">
            {/* GRID: 1 coluna no mobile, 12 colunas no desktop */}
            <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-3">

                {/* --- SEÇÃO 1: Computador (Ocupa 3 colunas no desktop) --- */}
                <div className="flex items-center gap-3 lg:col-span-3">
                    <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 shrink-0">
                        <LuMonitor size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm text-slate-800 line-clamp-1" title={data.pc?.nome}>
                            {data.pc?.nome || "PC Desconhecido"}
                        </h3>
                        <div className="flex flex-col mt-0.5 text-[11px] text-slate-500">
                            <span>PAT: <span className="font-medium text-slate-700">{data.pc?.patrimonio || "N/A"}</span></span>
                            <span className="line-clamp-1">{data.pc?.localizacao}</span>
                        </div>
                    </div>
                </div>

                {/* --- SEÇÃO 2: Problema + Prioridade (Ocupa 4 colunas no desktop) --- */}
                <div className="flex flex-col justify-center gap-1.5 lg:col-span-4">
                    <div className="flex items-start gap-2">
                        <AlertTriangle size={16} className="text-orange-500 shrink-0 mt-0.5" />
                        <span className="font-medium text-sm text-slate-700 line-clamp-2" title={data.descricaoProblema}>
                            {data.descricaoProblema}
                        </span>
                    </div>
                    <div className="ml-6">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider inline-block
                            ${data.prioridade === 'ALTA' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                            {data.prioridade}
                        </span>
                    </div>
                </div>

                {/* --- SEÇÃO 3: Técnico e Data (Ocupa 2 colunas no desktop) --- */}
                <div className="flex flex-row lg:flex-col gap-4 lg:gap-1.5 text-sm text-slate-600 lg:col-span-2">
                    <div className="flex items-center gap-2" title="Técnico Responsável">
                        <User size={14} className="text-slate-400 shrink-0" />
                        <span className="text-xs font-medium truncate">{data.nomeTecnico}</span>
                    </div>
                    <div className="flex items-center gap-2" title="Previsão de Entrega">
                        <Calendar size={14} className="text-slate-400 shrink-0" />
                        <span className="text-xs truncate">
                            {data.dataPrevisao ? new Date(data.dataPrevisao).toLocaleDateString('pt-BR') : '--/--/--'}
                        </span>
                    </div>
                </div>

                {/* --- SEÇÃO 4: Status (Ocupa 2 colunas no desktop) --- */}
                <div className="flex items-center justify-start lg:justify-center lg:col-span-2">
                    <span className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase border text-center whitespace-nowrap ${getStatusColor(data.status)}`}>
                        {data.status}
                    </span>
                </div>

                {/* --- SEÇÃO 5: Ações (Ocupa 1 coluna no desktop) --- */}
                <div className="flex items-center justify-end gap-1 lg:col-span-1 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:cursor-pointer"
                        onClick={() => onView && onView(data.id || 0)}
                        title="Visualizar Detalhes"
                    >
                        <Eye size={16} />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:cursor-pointer"
                        onClick={() => onEdit && onEdit(data.id || 0)}
                        title="Editar / Atualizar"
                    >
                        <Pencil  size={16} />
                    </Button>
                </div>

            </CardContent>
        </Card>
    );
}