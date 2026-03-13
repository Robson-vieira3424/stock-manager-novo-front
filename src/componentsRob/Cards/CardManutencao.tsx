import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LuMonitor } from "react-icons/lu";
import { AlertTriangle, User, Calendar, Eye, Pencil, CheckCircle2, XCircle, Wrench, Circle, Zap } from "lucide-react";
import { manutecaoDTO } from "@/types/manutencaoDTO";

interface CardProps {
    data: manutecaoDTO;
    onView?: (id: number) => void;
    onEdit?: (id: number) => void;
}

type StatusConfig = {
    label: string;
    containerClass: string;
    borderClass: string;
    icon: React.ReactNode;
};

type PrioridadeConfig = {
    label: string;
    containerClass: string;
    style?: React.CSSProperties;
};

const getStatusConfig = (status: string): StatusConfig => {
    const s = status?.toUpperCase();

    switch (s) {
        case 'CONCLUIDA':
            return {
                label: 'Concluída',
                containerClass: 'bg-green-50 text-green-700 border-green-200',
                borderClass: 'border-l-green-500',
                icon: <CheckCircle2 size={13} className="text-green-600 shrink-0" />,
            };
        case 'CANCELADA':
            return {
                label: 'Cancelada',
                containerClass: 'bg-gray-100 text-gray-500 border-gray-200',
                borderClass: 'border-l-gray-400',
                icon: <XCircle size={13} className="text-gray-400 shrink-0" />,
            };
        case 'EM_ANDAMENTO':
            return {
                label: 'Em Andamento',
                containerClass: 'bg-blue-50 text-blue-700 border-blue-200',
                borderClass: 'border-l-blue-500',
                icon: <Wrench size={13} className="text-blue-500 shrink-0" />,
            };
        case 'ABERTA':
            return {
                label: 'Aberta',
                containerClass: 'bg-yellow-50 text-yellow-700 border-yellow-200',
                borderClass: 'border-l-yellow-400',
                icon: <Circle size={10} className="text-yellow-500 shrink-0 fill-yellow-400" />,
            };
        case 'AGUARDANDO_PECA':
            return {
                label: 'Aguard. Peça',
                containerClass: 'bg-orange-50 text-orange-700 border-orange-200',
                borderClass: 'border-l-orange-500',
                icon: <Circle size={10} className="text-orange-500 shrink-0 fill-orange-400" />,
            };
        default:
            return {
                label: status,
                containerClass: 'bg-slate-100 text-slate-600 border-slate-200',
                borderClass: 'border-l-slate-400',
                icon: <Circle size={10} className="text-slate-400 shrink-0 fill-slate-300" />,
            };
    }
};

const getPrioridadeConfig = (prioridade: string): PrioridadeConfig => {
    const p = prioridade?.toUpperCase();

    switch (p) {
        case 'BAIXA':
            return {
                label: 'Baixa',
                containerClass: 'bg-slate-100 text-slate-500',
                style: undefined,
            };
        case 'MEDIA':
            return {
                label: 'Média',
                containerClass: '',
                style: { backgroundColor: '#FFFBEB', color: '#DD851E' },
            };
        case 'ALTA':
            return {
                label: 'Alta',
                containerClass: '',
                style: { backgroundColor: '#FFF7ED', color: '#FEECDE' },
            };
        case 'CRITICA':
            return {
                label: 'Crítica',
                containerClass: 'bg-purple-100 text-purple-800',
                style: undefined,
            };
        default:
            return {
                label: prioridade,
                containerClass: 'bg-slate-100 text-slate-500',
            };
    }
};

export default function CardManutencao({ data, onView, onEdit }: CardProps) {
    const statusConfig = getStatusConfig(data.status);
    const prioridadeConfig = getPrioridadeConfig(data.prioridade);

    return (
        <Card className={`w-full p-0 mb-3 hover:bg-slate-50 transition-all border-l-4 ${statusConfig.borderClass} shadow-sm overflow-hidden`}>
            <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-3">

                {/* --- SEÇÃO 1: Computador (3 colunas) --- */}
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

                {/* --- SEÇÃO 2: Problema + Prioridade (4 colunas) --- */}
                <div className="flex flex-col justify-center gap-1.5 lg:col-span-4">
                    <div className="flex items-start gap-2">
                        <AlertTriangle size={16} className="text-orange-500 shrink-0 mt-0.5" />
                        <span className="font-medium text-sm text-slate-700 line-clamp-2" title={data.descricaoProblema}>
                            {data.descricaoProblema}
                        </span>
                    </div>
                    <div className="ml-6">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider inline-flex items-center gap-1 ${prioridadeConfig.containerClass}`} style={prioridadeConfig.style}>
                            {data.prioridade?.toUpperCase() === 'CRITICA' && (
                                <Zap size={11} className="text-purple-700 fill-purple-700 shrink-0" />
                            )}
                            {prioridadeConfig.label}
                        </span>
                    </div>
                </div>

                {/* --- SEÇÃO 3: Técnico e Data (2 colunas) --- */}
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

                {/* --- SEÇÃO 4: Status + Ações (3 colunas) --- */}
                <div className="flex items-center justify-between lg:justify-end gap-3 lg:col-span-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold uppercase border whitespace-nowrap ${statusConfig.containerClass}`}>
                        {statusConfig.label}
                        {statusConfig.icon}
                    </span>

                   
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:cursor-pointer"
                                onClick={() => onView && onView(data.id || 0)}
                                title="Visualizar Detalhes"
                            >
                                <Eye size={16} />
                            </Button>
                        {!['CONCLUIDA', 'CANCELADA'].includes(data.status?.toUpperCase()) && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:cursor-pointer"
                                onClick={() => onEdit && onEdit(data.id || 0)}
                                title="Editar / Atualizar"
                            >
                                <Pencil size={16} />
                                 
                            </Button>
                        )}
                        </div>
                  
                </div>

            </CardContent>
        </Card>
    );
}