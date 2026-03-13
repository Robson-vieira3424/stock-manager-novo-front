import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Wrench, AlertCircle, Trash2, Plus, Monitor, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

import api from "@/services/api";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { manutecaoDTO } from "@/types/manutencaoDTO";
import { Produto } from "@/types/produto";
import { Input } from "@/components/ui/input";

interface FormAtualizarManutencaoProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    manutencao: manutecaoDTO | null;
    onSuccess?: () => void;
}

const statusOpcoes = [
    { value: "EM_ANDAMENTO", label: "Em Andamento" },
    { value: "AGUARDANDO_PECA", label: "Aguardando Peça" },
    { value: "CONCLUIDA", label: "Concluída" },
    { value: "CANCELADA", label: "Cancelada" },
    { value: "ABERTA", label: "Aberta" },
];

const prioridadeOpcoes = [
    { value: "BAIXA", label: "Baixa" },
    { value: "MEDIA", label: "Média" },
    { value: "ALTA", label: "Alta" },
    { value: "CRITICA", label: "Crítica" },
];

export default function FormAtualizarManutencao({
    open,
    onOpenChange,
    manutencao,
    onSuccess
}: FormAtualizarManutencaoProps) {

    const form = useForm({
        defaultValues: {
            status: "",
            prioridade: "",
            dataPrevisao: undefined as Date | undefined,
            comentarioTecnico: "",
            solucaoAplicada: "",
            utilizouPeca: "nao",
        }
    });

    const statusAtual = form.watch("status");
    const utilizouPecaSelecionado = form.watch("utilizouPeca");

    const [loading, setLoading] = useState(false);
    const [pecasDisponiveis, setPecasDisponiveis] = useState<Produto[]>([]);
    const [pecaSelecionadaId, setPecaSelecionadaId] = useState<string>("");
    const [quantidadePeca, setQuantidadePeca] = useState<number>(1);
    const [pecasUsadas, setPecasUsadas] = useState<{ id: number; name: string; qtd: number }[]>([]);

    useEffect(() => {
        if (utilizouPecaSelecionado === "sim" && pecasDisponiveis.length === 0) {
            handlePecasDisponiveis();
        }
    }, [utilizouPecaSelecionado, pecasDisponiveis.length]);

    useEffect(() => {
        if (manutencao && open) {
            form.reset({
                status: manutencao.status || "",
                prioridade: manutencao.prioridade || "",
                dataPrevisao: manutencao.dataPrevisao ? new Date(manutencao.dataPrevisao) : undefined,
                comentarioTecnico: manutencao.comentarioTecnico || "",
                solucaoAplicada: "",
                utilizouPeca: "nao",
            });
            setPecasUsadas([]);
        }
    }, [manutencao, open, form]);

    if (!manutencao) return null;

    async function handlePecasDisponiveis() {
        setLoading(true);
        try {
            const response = await api.get("/manutencao/pecasDisponiveis");
            setPecasDisponiveis(response.data);
        } catch (erro) {
            console.log("Erro ao buscar peças disponíveis: ", erro);
        } finally {
            setLoading(false);
        }
    }

    const adicionarPeca = () => {
        if (!pecaSelecionadaId || quantidadePeca < 1) return;
        const pecaDb = pecasDisponiveis.find(p => p.id.toString() === pecaSelecionadaId);
        if (!pecaDb) return;
        setPecasUsadas(prev => {
            const existe = prev.find(p => p.id === pecaDb.id);
            if (existe) return prev.map(p => p.id === pecaDb.id ? { ...p, qtd: p.qtd + quantidadePeca } : p);
            return [...prev, { id: pecaDb.id, name: pecaDb.name, qtd: quantidadePeca }];
        });
        setPecaSelecionadaId("");
        setQuantidadePeca(1);
    };

    const removerPeca = (id: number) => setPecasUsadas(prev => prev.filter(p => p.id !== id));

    const onSubmit = async (data: any) => {
        if (!manutencao?.id) return;
        try {
            const payload = {
                status: data.status,
                prioridade: data.prioridade,
                dataPrevisao: data.dataPrevisao ? data.dataPrevisao.toISOString().split('T')[0] : null,
                comentarioTecnico: data.comentarioTecnico,
                solucaoAplicada: data.solucaoAplicada,
                ultilizouPeca: data.utilizouPeca === "sim" ? "Sim" : "Nao",
                pecas: data.utilizouPeca === "sim" ? pecasUsadas.map(p => ({ id: p.id, quantity: p.qtd })) : [],
            };
            await api.put(`/manutencao/${manutencao.id}`, payload);
            alert("Manutenção atualizada com sucesso!");
            onOpenChange(false);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Erro ao atualizar", error);
            alert("Erro ao atualizar manutenção.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] max-h-[85vh] flex flex-col">

                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-blue-600" />
                        Atualizar Manutenção
                    </DialogTitle>
                    <DialogDescription>
                        Patrimônio: <strong className="text-slate-700">{manutencao.pc?.patrimonio}</strong> · Técnico: <strong className="text-slate-700">{manutencao.nomeTecnico || "Não atribuído"}</strong>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4 overflow-y-auto px-4">

                    {/* Card do computador (somente leitura) */}
                    <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50">
                        <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                            <Monitor className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 leading-none mb-1">{manutencao.pc?.nome || "PC Desconhecido"}</span>
                            <span className="text-sm text-gray-500">Patrimônio: {manutencao.pc?.patrimonio || "N/A"}</span>
                            <span className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {manutencao.pc?.localizacao || "—"}
                            </span>
                        </div>
                    </div>

                    {/* Status + Prioridade */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label>Status da Manutenção</Label>
                            <Controller
                                name="status"
                                control={form.control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOpcoes.map(s => (
                                                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Prioridade</Label>
                            <Controller
                                name="prioridade"
                                control={form.control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione a prioridade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {prioridadeOpcoes.map(p => (
                                                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>

                    {/* Previsão de Retorno */}
                    <div className="flex flex-col gap-2">
                        <Label>Previsão de Retorno</Label>
                        <Controller
                            name="dataPrevisao"
                            control={form.control}
                            render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Selecione a data</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={ptBR} />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                    </div>

                    {/* Comentário do Técnico */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="comentarioTecnico">Comentário do Técnico</Label>
                        <Controller
                            name="comentarioTecnico"
                            control={form.control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id="comentarioTecnico"
                                    className="min-h-[100px] w-full resize-none focus-visible:ring-blue-600"
                                    placeholder="Detalhe o que foi feito ou o que está pendente..."
                                />
                            )}
                        />
                    </div>

                    {/* Solução Aplicada — só aparece quando CONCLUIDA */}
                    {statusAtual === "CONCLUIDA" && (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="solucaoAplicada" className="flex items-center gap-1.5">
                                <AlertCircle className="h-3.5 w-3.5 text-green-600" />
                                Solução Aplicada
                            </Label>
                            <Controller
                                name="solucaoAplicada"
                                control={form.control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        id="solucaoAplicada"
                                        className="min-h-[100px] w-full resize-none focus-visible:ring-green-600"
                                        placeholder="Descreva a solução que resolveu o problema..."
                                    />
                                )}
                            />
                        </div>
                    )}

                    {/* Utilizou Peças */}
                    <div className="flex flex-col gap-2 w-full md:w-1/2">
                        <Label>Utilizou alguma peça?</Label>
                        <Controller
                            name="utilizouPeca"
                            control={form.control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sim">Sim</SelectItem>
                                        <SelectItem value="nao">Não</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* Painel de Peças */}
                    {utilizouPecaSelecionado === "sim" && (
                        <div className="p-4 border rounded-lg bg-slate-50 flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                                <AlertCircle className="h-4 w-4 text-orange-500" />
                                Peças Utilizadas
                            </div>

                            <div className="flex flex-col md:flex-row gap-3 items-end">
                                <div className="flex flex-col gap-2 flex-1">
                                    <Label>Selecionar Peça</Label>
                                    <Select value={pecaSelecionadaId} onValueChange={setPecaSelecionadaId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={loading ? "Carregando..." : "Escolha uma peça..."} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {pecasDisponiveis.map(peca => (
                                                <SelectItem key={peca.id} value={peca.id.toString()}>
                                                    {peca.name} (Estoque: {peca.quantity})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2 w-24">
                                    <Label>Qtd.</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={quantidadePeca}
                                        onChange={e => setQuantidadePeca(Number(e.target.value))}
                                    />
                                </div>
                                <Button type="button" variant="secondary" onClick={adicionarPeca} disabled={!pecaSelecionadaId}>
                                    <Plus className="h-4 w-4 mr-1" /> Add
                                </Button>
                            </div>

                            {pecasUsadas.length > 0 && (
                                <div className="border rounded-md bg-white overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-100 text-slate-600">
                                            <tr>
                                                <th className="px-4 py-2 font-medium">Produto</th>
                                                <th className="px-4 py-2 font-medium w-24 text-center">Qtd</th>
                                                <th className="px-4 py-2 font-medium w-16 text-center">Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pecasUsadas.map(item => (
                                                <tr key={item.id} className="border-t">
                                                    <td className="px-4 py-2">{item.name}</td>
                                                    <td className="px-4 py-2 text-center">{item.qtd}</td>
                                                    <td className="px-4 py-2 text-center">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 text-red-500 hover:text-red-700"
                                                            onClick={() => removerPeca(item.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="default">
                            Atualizar Manutenção
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}