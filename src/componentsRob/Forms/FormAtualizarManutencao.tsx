import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Wrench, AlertCircle, Trash2, Plus } from "lucide-react";
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

const statusOpcoes = ["ANDAMENTO", "AGUARDANDO_PECA", "PRONTO", "BAIXADO", "CONCLUIDA", ];

export default function FormAtualizarManutencao({
    open,
    onOpenChange,
    manutencao,
    onSuccess
}: FormAtualizarManutencaoProps) {

    // =========================================================================
    // 1. TODOS OS HOOKS E STATES (Sempre no topo, nunca atras de "if" ou "return")
    // =========================================================================
    const form = useForm({
        defaultValues: {
            status: "",
            dataPrevisao: undefined as Date | undefined,
            comentarioTecnico: "",
            utilizouPeca: "nao",
        }
    });

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
                dataPrevisao: manutencao.dataPrevisao ? new Date(manutencao.dataPrevisao) : undefined,
                comentarioTecnico: manutencao.comentarioTecnico || "",
                utilizouPeca: manutencao.utilizouPeca ? "sim" : "nao",
            });
            // Opcional: Se a manutenção já tiver peças vindas do backend, você pode popular o estado `pecasUsadas` aqui.
        }
    }, [manutencao, open, form]);

    // =========================================================================
    // 2. CONDIÇÃO DE RETORNO (Só depois de declarar todos os hooks)
    // =========================================================================
    if (!manutencao) return null;

    // =========================================================================
    // 3. FUNÇÕES
    // =========================================================================
    async function handlePecasDisponiveis() {
        setLoading(true);
        try {
            const response = await api.get("/manutencao/pecasDisponiveis");
            setPecasDisponiveis(response.data);
        } catch (erro) {
            console.log("erro ao buscar peças disponíveis: ", erro);
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
            if (existe) {
                return prev.map(p => p.id === pecaDb.id ? { ...p, qtd: p.qtd + quantidadePeca } : p);
            }
            return [...prev, { id: pecaDb.id, name: pecaDb.name, qtd: quantidadePeca }];
        });

        setPecaSelecionadaId("");
        setQuantidadePeca(1);
    };

    const removerPeca = (id: number) => {
        setPecasUsadas(prev => prev.filter(p => p.id !== id));
    };

    const onSubmit = async (data: any) => {
        if (!manutencao?.id) return;

        try {
            const payload = {
                status: data.status,
                dataPrevisao: data.dataPrevisao ? data.dataPrevisao.toISOString().split('T')[0] : null,
                comentarioTecnico: data.comentarioTecnico,
                utilizouPeca: data.utilizouPeca === "sim",
                // Adicionei a lista de peças aqui para você enviar ao backend!
                pecas: data.utilizouPeca === "sim" ? pecasUsadas : []
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

    // =========================================================================
    // 4. RENDERIZAÇÃO DA TELA
    // =========================================================================
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-blue-600" />
                        Atualizar Manutenção: {manutencao.pc?.nome}
                    </DialogTitle>
                    <DialogDescription>
                        Patrimônio: <strong className="text-slate-700">{manutencao.pc?.patrimonio}</strong> |
                        Técnico: <strong className="text-slate-700">{manutencao.nomeTecnico || "Não atribuído"}</strong>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4 overflow-y-auto px-1">
                    {/* Linha 1: Status e Previsão (Metade da tela cada) */}
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
                                            {statusOpcoes.map((s) => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Previsão de Retorno</Label>
                            <Controller
                                name="dataPrevisao"
                                control={form.control}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? (
                                                    format(field.value, "PPP", { locale: ptBR })
                                                ) : (
                                                    <span>Selecione a data</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                                locale={ptBR}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                        </div>
                    </div>

                    {/* Linha 2: Comentário do Técnico */}
                    <div className="flex flex-col gap-2 w-full">
                        <Label htmlFor="comentarioTecnico">Comentário do Técnico</Label>
                        <Controller
                            name="comentarioTecnico"
                            control={form.control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id="comentarioTecnico"
                                    className="min-h-[100px] w-full resize-none break-all whitespace-pre-wrap focus-visible:ring-blue-600 focus-visible:border-none"
                                    placeholder="Detalhe o que foi feito ou o que está pendente..."
                                />
                            )}
                        />
                    </div>

                    {/* Linha 3: Utilizou Peças? */}
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

                    {utilizouPecaSelecionado === "sim" && (
                        <div className="p-4 border rounded-md bg-slate-50 flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-slate-700 font-medium mb-1">
                                <AlertCircle className="h-4 w-4 text-orange-500" />
                                Peças Utilizadas
                            </div>

                            {/* Controles para Adicionar Peça */}
                            <div className="flex flex-col md:flex-row gap-3 items-end">
                                <div className="flex flex-col gap-2 flex-1">
                                    <Label>Selecionar Peça</Label>
                                    <Select value={pecaSelecionadaId} onValueChange={setPecaSelecionadaId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={loading ? "Carregando..." : "Escolha uma peça..."} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {pecasDisponiveis.map((peca) => (
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
                                        onChange={(e) => setQuantidadePeca(Number(e.target.value))}
                                    />
                                </div>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={adicionarPeca}
                                    disabled={!pecaSelecionadaId}
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add
                                </Button>
                            </div>

                            {/* Lista de Peças Adicionadas */}
                            {pecasUsadas.length > 0 && (
                                <div className="mt-2 border rounded-md bg-white overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-100 text-slate-600">
                                            <tr>
                                                <th className="px-4 py-2 font-medium">Produto</th>
                                                <th className="px-4 py-2 font-medium w-24 text-center">Qtd</th>
                                                <th className="px-4 py-2 font-medium w-16 text-center">Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pecasUsadas.map((item) => (
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

                    <div className="flex justify-end pt-4 border-t">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="mr-2">
                            Cancelar
                        </Button>
                        <Button type="submit" variant="default">Atualizar Manutenção</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}