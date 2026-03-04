import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, Monitor, User, Calendar, AlertTriangle } from "lucide-react";
import { manutecaoDTO } from "@/types/manutencaoDTO";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FormVisualizarManutencaoProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    manutencao: manutecaoDTO | null;
}

export default function FormVisualizarManutencao({ open, onOpenChange, manutencao }: FormVisualizarManutencaoProps) {
    if (!manutencao) return null;

    // Formata a data se existir
    const dataFormatada = manutencao.dataPrevisao
        ? format(new Date(manutencao.dataPrevisao), "dd/MM/yyyy", { locale: ptBR })
        : "Não definida";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Eye className="h-5 w-5 text-blue-600" />
                        Detalhes da Manutenção
                    </DialogTitle>
                    <DialogDescription>
                        Visualizando todas as informações registradas para esta Ordem de Serviço.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4 overflow-y-auto px-1">

                    {/* SEÇÃO 1: Dados do Equipamento */}
                    <div className="p-4 bg-slate-50 border rounded-lg space-y-4">
                        <h3 className="font-semibold text-slate-700 flex items-center gap-2 border-b pb-2">
                            <Monitor className="h-4 w-4" /> Dados do Equipamento
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1.5 md:col-span-2">
                                <Label>Nome / Localização</Label>
                                <Input readOnly value={`${manutencao.pc?.nome || ''} - ${manutencao.pc?.localizacao || ''}`} className="bg-white" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label>Patrimônio</Label>
                                <Input readOnly value={manutencao.pc?.patrimonio || 'N/A'} className="bg-white font-mono" />
                            </div>
                            <div className="flex flex-col gap-1.5 md:col-span-3">
                                <Label>Especificações</Label>
                                <Input
                                    readOnly
                                    value={[manutencao.pc?.processador, manutencao.pc?.memoria, manutencao.pc?.armazenamento].filter(Boolean).join(" | ") || "Sem especificações cadastradas"}
                                    className="bg-white text-xs"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SEÇÃO 2: Informações Técnicas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Status</Label>
                            <Input readOnly value={manutencao.status || ''} className="bg-slate-50 font-semibold" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label>Prioridade</Label>
                            <Input readOnly value={manutencao.prioridade || ''} className="bg-slate-50" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label>Tipo</Label>
                            <Input readOnly value={manutencao.tipo || ''} className="bg-slate-50" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label className="flex items-center gap-1"><User className="h-3 w-3" /> Técnico Responsável</Label>
                            <Input readOnly value={manutencao.nomeTecnico || 'Não atribuído'} className="bg-slate-50" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Previsão de Retorno</Label>
                            <Input readOnly value={dataFormatada} className="bg-slate-50" />
                        </div>
                    </div>

                    {/* SEÇÃO 3: Textos e Descrições */}
                    <div className="flex flex-col gap-1.5">
                        <Label>Descrição do Problema Reportado</Label>
                        <Textarea readOnly value={manutencao.descricaoProblema || ''} className="bg-slate-50 min-h-[80px] resize-none" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label>Comentário do Técnico</Label>
                        <Textarea readOnly value={manutencao.comentarioTecnico || 'Nenhum comentário adicionado.'} className="bg-slate-50 min-h-[80px] resize-none" />
                    </div>

                    {manutencao.observacao && (
                        <div className="flex flex-col gap-1.5">
                            <Label>Observações Adicionais</Label>
                            <Textarea readOnly value={manutencao.observacao} className="bg-slate-50 min-h-[60px] resize-none" />
                        </div>
                    )}

                </div>

                <div className="flex justify-end pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Fechar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}