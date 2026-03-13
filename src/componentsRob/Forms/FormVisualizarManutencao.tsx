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
import { Eye, Monitor, User, Calendar, AlertTriangle, MapPin, Cpu } from "lucide-react";
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

    const dataFormatada = manutencao.dataPrevisao
        ? format(new Date(manutencao.dataPrevisao), "PPP", { locale: ptBR })
        : "Não definida";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-blue-600" />
                        Detalhes da Manutenção
                    </DialogTitle>
                    <DialogDescription>
                        Visualizando todas as informações registradas para esta Ordem de Serviço.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4 overflow-y-auto px-4">

                    {/* Computador selecionado — mesmo card do FormManutencao */}
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 items-center text-sm font-medium">
                            <Monitor className="h-4 w-4" />
                            <Label>Computador</Label>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Monitor className="h-6 w-6" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-lg text-gray-900 leading-none mb-1">
                                        {manutencao.pc?.nome || "PC Desconhecido"}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Patrimônio: {manutencao.pc?.patrimonio || "N/A"}
                                    </span>
                                    <span className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> {manutencao.pc?.localizacao || "—"}
                                    </span>
                                </div>
                            </div>
                            {manutencao.pc?.processador && (
                                <span className="text-xs text-slate-500 flex items-center gap-1 hidden md:flex">
                                    <Cpu className="h-3 w-3" />
                                    {[manutencao.pc.processador, manutencao.pc.memoria, manutencao.pc.armazenamento]
                                        .filter(Boolean).join(" · ")}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Descrição do Problema */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="descricao" className="flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-orange-500" /> Descrição do Problema
                        </Label>
                        <Textarea
                            id="descricao"
                            readOnly
                            value={manutencao.descricaoProblema || ''}
                            className="min-h-[100px] w-full resize-none bg-slate-50"
                        />
                    </div>

                    {/* Técnico + Tipo */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label className="flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5" /> Técnico Responsável
                            </Label>
                            <Input readOnly value={manutencao.nomeTecnico || 'Não atribuído'} className="bg-slate-50" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Tipo de Manutenção</Label>
                            <Input readOnly value={manutencao.tipo || '—'} className="bg-slate-50" />
                        </div>
                    </div>

                    {/* Prioridade + Data */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label>Prioridade</Label>
                            <Input readOnly value={manutencao.prioridade || '—'} className="bg-slate-50" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" /> Previsão de Retorno
                            </Label>
                            <Input readOnly value={dataFormatada} className="bg-slate-50" />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-2">
                        <Label>Status</Label>
                        <Input readOnly value={manutencao.status || '—'} className="bg-slate-50 font-semibold" />
                    </div>

                    {/* Comentário do Técnico */}
                    <div className="flex flex-col gap-2">
                        <Label>Comentário do Técnico</Label>
                        <Textarea
                            readOnly
                            value={manutencao.comentarioTecnico || 'Nenhum comentário adicionado.'}
                            className="min-h-[100px] w-full resize-none bg-slate-50"
                        />
                    </div>

                    {/* Observações (só exibe se tiver) */}
                    {manutencao.observacao && (
                        <div className="flex flex-col gap-2">
                            <Label>Observações</Label>
                            <Textarea
                                readOnly
                                value={manutencao.observacao}
                                className="min-h-[80px] w-full resize-none bg-slate-50"
                            />
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