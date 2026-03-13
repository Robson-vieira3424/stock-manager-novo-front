import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CardManutencao from "../Cards/CardManutencao";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Wrench } from "lucide-react";
import { manutecaoDTO } from "@/types/manutencaoDTO";
import { useState } from "react";

interface ManutencoesPainelProps {
    data: manutecaoDTO[];
    onEdit?: (id: number) => void;
    onView?: (id: number) => void;
}

const TABS = [
    { value: "todos", label: "TODOS", filtro: null },
    { value: "andamento", label: "EM ANDAMENTO", filtro: "EM_ANDAMENTO" },
    { value: "pecas", label: "PEÇAS", filtro: "AGUARDANDO_PECA" },
    { value: "prontos", label: "PRONTOS", filtro: "CONCLUIDA" },
    { value: "baixados", label: "CANCELADAS", filtro: "CANCELADA" },
];

export default function PainelOs({ data, onEdit, onView }: ManutencoesPainelProps) {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [tabAtiva, setTabAtiva] = useState("todos");

    const handleTabChange = (value: string) => {
        setTabAtiva(value);
        setPaginaAtual(1);
    };

    const handleItensPorPagina = (value: string) => {
        setItensPorPagina(Number(value));
        setPaginaAtual(1);
    };

    const getItensFiltrados = (filtro: string | null) =>
        filtro ? data.filter(item => item.status === filtro) : data;

    const renderContent = (filtro: string | null) => {
        const itensFiltrados = getItensFiltrados(filtro);
        const inicio = (paginaAtual - 1) * itensPorPagina;
        const itensPaginados = itensFiltrados.slice(inicio, inicio + itensPorPagina);

        if (itensFiltrados.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                    <Wrench size={40} strokeWidth={1.5} className="text-slate-300" />
                    <span className="text-sm">Nenhuma ordem de serviço nesta categoria</span>
                </div>
            );
        }

        return itensPaginados.map((manutencao) => (
            <CardManutencao key={manutencao.id} data={manutencao} onEdit={onEdit} onView={onView} />
        ));
    };

    const tabAtual = TABS.find(t => t.value === tabAtiva)!;
    const totalItens = getItensFiltrados(tabAtual.filtro).length;
    const totalPaginas = Math.max(1, Math.ceil(totalItens / itensPorPagina));
    const inicioExibicao = totalItens === 0 ? 0 : (paginaAtual - 1) * itensPorPagina + 1;
    const fimExibicao = Math.min(paginaAtual * itensPorPagina, totalItens);

    return (
        <Tabs defaultValue="todos" className="w-full" onValueChange={handleTabChange}>
            <Card>
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl">Ordens de Serviço</CardTitle>
                            <CardDescription>Gerencie os computadores em manutenção</CardDescription>
                        </div>
                        <TabsList className="flex w-auto h-9">
                            {TABS.map(tab => (
                                <TabsTrigger key={tab.value} className="text-xs px-3 hover:cursor-pointer" value={tab.value}>
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                </CardHeader>

                <CardContent>
                    {TABS.map(tab => (
                        <TabsContent key={tab.value} value={tab.value}>
                            {renderContent(tab.filtro)}
                        </TabsContent>
                    ))}
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t border-slate-100 pt-4 gap-4">

                    {/* ESQUERDA: itens por página */}
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="whitespace-nowrap">Exibir</span>
                        <Select value={String(itensPorPagina)} onValueChange={handleItensPorPagina}>
                            <SelectTrigger className="h-8 w-[70px] text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 15, 25, 50].map(n => (
                                    <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="whitespace-nowrap">por página</span>
                    </div>

                    {/* CENTRO: contagem */}
                    <span className="text-sm text-slate-500 whitespace-nowrap">
                        {totalItens === 0
                            ? "Nenhum registro"
                            : `Exibindo ${inicioExibicao}–${fimExibicao} de ${totalItens}`}
                    </span>

                    {/* DIREITA: navegação */}
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                            disabled={paginaAtual === 1}
                        >
                            <ChevronLeft size={15} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                            disabled={paginaAtual === totalPaginas}
                        >
                            <ChevronRight size={15} />
                        </Button>
                    </div>

                </CardFooter>
            </Card>
        </Tabs>
    );
}