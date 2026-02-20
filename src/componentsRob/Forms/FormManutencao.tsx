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
}
interface TecnicoDTO {
    id: number;
    nome: string;
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

export default function FormManutencao({ open, onOpenChange }: FormManutencaoProps) {
    const [tecnicos, setTecnicos] = useState<TecnicoDTO[]>([]);

    const [selectedComputer, setSelectedComputer] = useState<ComputadorBuscaDTO | null>(null);

    const [sugestoesComputadores, setSugestoesComputadores] = useState<ComputadorBuscaDTO[]>([]);
    const [buscandoPC, setBuscandoPC] = useState(false);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

    const form = useForm({
        defaultValues: {
            patrimonio: "",
            descricao: "",
            tecnico: "",
            tipoManutencao: "", // Adicionado ao defaultValues
            prioridade: "",
            dataPrevisao: undefined as Date | undefined,
        }
    });

    async function getTecnicos() {
        try {
            const resposta = await api.get("/users/permission/ROLE_TECNICO");
            // Proteção extra caso a API retorne algo que não seja array
            if (Array.isArray(resposta.data)) {
                setTecnicos(resposta.data);
            }
        } catch (erro) {
            console.log("Erro ao buscar os tecnicos", erro);
        }
    }

    async function buscarComputadores(termo: string) {
        if (!termo || termo.length < 2) { // Só busca se tiver 2+ letras
            setSugestoesComputadores([]);
            setMostrarSugestoes(false);
            return;
        }

        setBuscandoPC(true);
        try {
            // Envia o termo como query param: /computador/buscar?termo=valor
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
        } else {
            getTecnicos();
        }
    }, [open]);

    const onSubmit = async (data: any) => {
        if (!selectedComputer) {
            alert("Selecione um computador!");
            return;
        }

        try {
            const payload = {
                computadorDTO: {
                    id: selectedComputer.id 
                },
                descricaoProblema: data.descricao,
                tipo: data.tipoManutencao,
                prioridade: data.prioridade.toUpperCase(), 
                observacao: data.observações,
                dataPrevisao: data.dataPrevisao ? data.dataPrevisao.toISOString().split('T')[0] : null, 
                tecnicoId: Number(data.tecnico)                
            };

            await api.post("/manutencao", payload);

            alert("Manutenção registrada com sucesso!");
            onOpenChange(false); // Fecha o modal
            form.reset(); // Limpa o form
            setSelectedComputer(null);
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
                    {/* CORREÇÃO 1: Adicionei o ID correspondente aqui */}
                    <DialogDescription id="dialog-description-text">
                        Preencha os campos abaixo para abrir um chamado técnico.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4 overflow-y-auto px-4 ">
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
                                                setSelectedComputer(null); // Limpa o card visual
                                                field.onChange(""); // Limpa o valor no formulário
                                            }}
                                        >
                                            <X className="h-5 w-5" />
                                        </Button>
                                    </div>
                                ) : (
                                    // --- INPUT DE BUSCA ---
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

                                        {/* --- LISTA DE SUGESTÕES (DROPDOWN) --- */}
                                        {mostrarSugestoes && sugestoesComputadores.length > 0 && (
                                            <div className="absolute w-full bg-white border rounded-md shadow-xl mt-1 max-h-60 overflow-y-auto z-50 top-full overflow-hidden">
                                                {sugestoesComputadores.map((pc) => (
                                                    <div
                                                        key={pc.patrimonio}
                                                        // "w-full" e "cursor-pointer" na div pai garantem o clique em toda a área
                                                        className="w-full px-4 py-3 hover:bg-slate-50 cursor-pointer border-b last:border-0 transition-colors flex items-center justify-between group"
                                                        onClick={() => {
                                                            field.onChange(pc.patrimonio); // Salva no form
                                                            setSelectedComputer(pc);       // Salva objeto para mostrar o Card
                                                            setMostrarSugestoes(false);    // Fecha lista
                                                        }}
                                                    >
                                                        <div className="flex flex-col gap-1">
                                                            <span className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                                                                {pc.nome}
                                                            </span>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                <span className=" px-1.5 py-0.5  text-gray-600 font-normal text-[14px]">
                                                                    {pc.patrimonio}
                                                                </span>
                                                                <span>•</span>
                                                                <span className="text-[14px]">{pc.localizacao}</span>
                                                            </div>
                                                        </div>

                                                        {/* Badge de Status Estilizado */}
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
                                    <span className="text-red-500 text-sm">
                                        {fieldState.error.message}
                                    </span>
                                )}
                            </div>
                        )}
                    />

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="descricao">Descrição do Problema *</Label>
                        <Controller
                            name="descricao"
                            control={form.control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id="descricao"
                                    className="min-h-[100px] w-full resize-none break-all whitespace-pre-wrap focus-visible:ring-blue-600 focus-visible:border-none"
                                    placeholder="Descreva o problema..."
                                />
                            )}
                        />
                    </div>


                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2 w-full">
                            <Label>Técnico Responsável</Label>
                            <Controller
                                name="tecnico"
                                control={form.control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione o técnico" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tecnicos?.map((tec) => (
                                                <SelectItem key={tec.id} value={String(tec.id)}>
                                                    {tec.nome}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
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

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="obs">Observações</Label>
                        <Controller
                            name="descricao"
                            control={form.control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id="obs"
                                    className="min-h-[100px] w-full resize-none break-all whitespace-pre-wrap focus-visible:ring-blue-600 focus-visible:border-none"
                                    placeholder="Observações adicionais..."
                                />
                            )}
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" variant="blue">Salvar Manutenção</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}