import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale"; // Para data em português
import { CalendarIcon, Monitor, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
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

interface FormManutencaoProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Dados simulados (Mock)
const tecnicos = [
    "Carlos Silva",
    "Ana Pereira",
    "Roberto Souza",
    "Fernanda Lima",
    "João Miguel"
];

const prioridades = [
    "Baixa",
    "Média",
    "Alta",
    "Crítica"
];

export default function FormManutencao({ open, onOpenChange }: FormManutencaoProps) {
    const form = useForm({
        defaultValues: {
            patrimonio: "",
            descricao: "",
            tecnico: "",
            prioridade: "",
            dataPrevisao: undefined as Date | undefined, // Importante tipar como Date
        }
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Registrar Nova Manutenção</DialogTitle>
                </DialogHeader>

                <form className="space-y-6 py-4">
                    <Controller
    name="patrimonio"
    control={form.control}
    render={({ field, fieldState }) => (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center text-sm font-medium">
                <Monitor className="h-4 w-4" />
                <Label htmlFor="patrimonio">Selecionar Computador</Label>
            </div>
            
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                
                <Input
                    {...field}
                    id="patrimonio"
                    autoFocus
                    className="pl-8" 
                    placeholder="Ex: Buscar por patrimônio, nome ou local..."
                />
            </div>

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
                                    placeholder="Descreva o problema apresentado pelo equipamento..."
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <Label>Técnico Responsável</Label>
                        <Controller
                            name="tecnico"
                            control={form.control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o técnico" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tecnicos.map((tech) => (
                                            <SelectItem key={tech} value={tech}>
                                                {tech}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">



                        <div className="flex flex-col gap-2">
                            <Label>Prioridade</Label>
                            <Controller
                                name="prioridade"
                                control={form.control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <Label htmlFor="descricao"> Obeservações</Label>
                        <Controller
                            name="observações"
                            control={form.control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id="descricao"
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