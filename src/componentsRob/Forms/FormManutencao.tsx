import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2, Monitor, Search, X } from "lucide-react";

import api from "@/services/api";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { useEffect, useState } from "react";

interface FormManutencaoProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

interface UsuarioLogado {
    id: number;
    nome: string;
    email: string;
    permissao: string;
}

const prioridades = ["BAIXA", "MEDIA", "ALTA", "CRITICA"];

interface ComputadorBuscaDTO {
    id: number;
    patrimonio: string;
    nome: string;
    localizacao: string;
    statusEquipamento: string;
}

const getStatusBadge = (status: string) => {
    const s = status?.toUpperCase() || "";
    if (s.includes("USO")) return "bg-green-100 text-green-700 border-green-200";
    if (s.includes("MANUTEN") || s.includes("DEFEITO")) return "bg-red-100 text-red-700 border-red-200";
    if (s.includes("DISPON")) return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
};

function getUsuarioLogado(): UsuarioLogado | null {
    const raw = localStorage.getItem("user_data");
    if (!raw) return null;
    return JSON.parse(raw) as UsuarioLogado;
}

export default function FormManutencao({ open, onOpenChange, onSuccess }: FormManutencaoProps) {
    const usuarioLogado = getUsuarioLogado();

    const [selectedComputer, setSelectedComputer] = useState<ComputadorBuscaDTO | null>(null);
    const [sugestoesComputadores, setSugestoesComputadores] = useState<ComputadorBuscaDTO[]>([]);
    const [buscandoPC, setBuscandoPC] = useState(false);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

    const form = useForm({
        defaultValues: {
            patrimonio: "",
            descricao: "",
            tipoManutencao: "",
            observacoes: "",
            prioridade: "",
            dataPrevisao: undefined as Date | undefined,
        }
    });

    async function buscarComputadores(termo: string) {
        if (!termo || termo.length < 2) {
            setSugestoesComputadores([]);
            setMostrarSugestoes(false);
            return;
        }

        setBuscandoPC(true);
        try {
            const { data } = await api.get(`/computador/buscar`, {
                params: { termo }
            });
            setSugestoesComputadores(data);
            setMostrarSugestoes(true);
        } catch (error) {
            console.error("Erro ao buscar computadores", error);
        } finally {
            setBuscandoPC(false);
        }
    }

    useEffect(() => {
        if (!open) {
            setSelectedComputer(null);
            setSugestoesComputadores([]);
            form.reset();
        }
    }, [open]);

    const onSubmit = async (data: any) => {
        if (!selectedComputer) {
            alert("Selecione um computador!");
            return;
        }

        if (!usuarioLogado?.id) {
            alert("Usuário não identificado. Faça login novamente.");
            return;
        }

        try {
            const payload = {
                pc: { id: selectedComputer.id },
                descricaoProblema: data.descricao,
                tipo: data.tipoManutencao,
                prioridade: data.prioridade.toUpperCase(),
                observacoes: data.observacoes,
                dataPrevisao: data.dataPrevisao ? data.dataPrevisao.toISOString().split('T')[0] : null,
                tecnicoId: usuarioLogado.id
            };

            await api.post("/manutencao", payload);

            alert("Manutenção registrada com sucesso!");
            onOpenChange(false);
            form.reset();
            setSelectedComputer(null);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Erro ao salvar", error);
            alert("Erro ao registrar manutenção.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[650px] max-h-[85vh] flex flex-col"
                aria-describedby="dialog-description-text"
            >
                <DialogHeader>
                    <DialogTitle>Registrar Nova Manutenção</DialogTitle>
                    <DialogDescription id="dialog-description-text">
                        Preencha os campos abaixo para abrir um chamado técnico.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4 overflow-y-auto px-4">

                    {/* Seleção de Computador */}
                    <Controller
                        name="patrimonio"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <div className="flex flex-col gap-2 relative z-50">
                                <div className="flex gap-2 items-center text-sm font-medium">
                                    <Monitor className="h-4 w-4" />
                                    <Label htmlFor="patrimonio">Selecionar Computador</Label>
                                </div>

                                {selectedComputer ? (
                                    <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-all bg-white group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                                                <Monitor className="h-6 w-6" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-lg text-gray-900 leading-none mb-1">
                                                    {selectedComputer.nome}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Patrimônio: {selectedComputer.patrimonio}
                                                </span>
                                                <span className="text-xs text-gray-400 mt-0.5">
                                                    {selectedComputer.localizacao}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                                            onClick={() => {
                                                setSelectedComputer(null);
                                                field.onChange("");
                                            }}
                                        >
                                            <X className="h-5 w-5" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        {buscandoPC ? (
                                            <Loader2 className="absolute left-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                                        ) : (
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        )}
                                        <Input
                                            {...field}
                                            id="patrimonio"
                                            className="pl-8"
                                            placeholder="Digite o patrimônio ou nome..."
                                            autoComplete="off"
                                            onChange={(e) => {
                                                field.onChange(e);
                                                buscarComputadores(e.target.value);
                                            }}
                                            onFocus={() => {
                                                if (field.value && sugestoesComputadores.length > 0) setMostrarSugestoes(true);
                                            }}
                                            onBlur={() => setTimeout(() => setMostrarSugestoes(false), 200)}
                                        />

                                        {mostrarSugestoes && sugestoesComputadores.length > 0 && (
                                            <div className="absolute w-full bg-white border rounded-md shadow-xl mt-1 max-h-60 overflow-y-auto z-50 top-full">
                                                {sugestoesComputadores.map((pc) => (
                                                    <div
                                                        key={pc.patrimonio}
                                                        className="w-full px-4 py-3 hover:bg-slate-50 cursor-pointer border-b last:border-0 transition-colors flex items-center justify-between group"
                                                        onClick={() => {
                                                            field.onChange(pc.patrimonio);
                                                            setSelectedComputer(pc);
                                                            setMostrarSugestoes(false);
                                                        }}
                                                    >
                                                        <div className="flex flex-col gap-1">
                                                            <span className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                                                                {pc.nome}
                                                            </span>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                <span className="text-gray-600 font-normal text-[14px]">{pc.patrimonio}</span>
                                                                <span>•</span>
                                                                <span className="text-[14px]">{pc.localizacao}</span>
                                                            </div>
                                                        </div>
                                                        <span className={`text-[10px] px-2 py-1 rounded-full border font-semibold ${getStatusBadge(pc.statusEquipamento)}`}>
                                                            {pc.statusEquipamento}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {mostrarSugestoes && sugestoesComputadores.length === 0 && !buscandoPC && field.value.length > 2 && (
                                            <div className="absolute w-full bg-white border rounded-md shadow-lg mt-1 p-4 text-sm text-gray-500 z-50 text-center">
                                                Nenhum computador encontrado com esses dados.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {fieldState.error && (
                                    <span className="text-red-500 text-sm">{fieldState.error.message}</span>
                                )}
                            </div>
                        )}
                    />

                    {/* Descrição */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="descricao">Descrição do Problema *</Label>
                        <Controller
                            name="descricao"
                            control={form.control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id="descricao"
                                    className="min-h-[100px] w-full resize-none break-all whitespace-pre-wrap focus-visible:ring-blue-600"
                                    placeholder="Descreva o problema..."
                                />
                            )}
                        />
                    </div>

                    {/* Técnico (somente leitura) + Tipo de Manutenção */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2 w-full">
                            <Label>Técnico Responsável</Label>
                            <div className="flex items-center p-3 border rounded-md bg-slate-50 h-10">
                                <span className="text-sm font-medium text-gray-800">
                                    {usuarioLogado?.nome ?? "Usuário não identificado"}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <Label>Tipo de Manutenção</Label>
                            <Controller
                                name="tipoManutencao"
                                control={form.control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MANUTENCAO_CORRETIVA">CORRETIVA</SelectItem>
                                            <SelectItem value="MANUTENCAO_PREVENTIVA">PREVENTIVA</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>

                    {/* Prioridade + Data de Previsão */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label>Prioridade</Label>
                            <Controller
                                name="prioridade"
                                control={form.control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Defina a prioridade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {prioridades.map((item) => (
                                                <SelectItem key={item} value={item.toLowerCase()}>
                                                    {item}
                                                </SelectItem>
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
                                                className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Selecione a data</span>}
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

                    {/* Observações */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="obs">Observações</Label>
                        <Controller
                            name="observacoes"
                            control={form.control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id="obs"
                                    className="min-h-[100px] w-full resize-none break-all whitespace-pre-wrap focus-visible:ring-blue-600"
                                    placeholder="Observações adicionais..."
                                />
                            )}
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" variant="blue" className="hover:cursor-pointer">
                            Salvar Manutenção
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}