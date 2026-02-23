import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CardManutencao from "../Cards/CardManutencao";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { manutecaoDTO } from "@/types/manutencaoDTO";

interface ManutencoesPainelProps {
    data: manutecaoDTO[];
}

export default function PainelOs({ data }: ManutencoesPainelProps) {

    const renderContent = (filtroStatus: string | null) => {

        const itensFiltrados = filtroStatus
            ? data.filter(item => item.status === filtroStatus)
            : data;

        if (itensFiltrados.length === 0) {
            return <div className="p-4 text-center text-gray-500">Nenhuma manutenção encontrada.</div>
        }

        return itensFiltrados.map((manutencao) => (
            <CardManutencao key={manutencao.id} data={manutencao} />
        ));
    };

    return (
        <Tabs defaultValue="todos" className="w-full">
            <Card>
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl">Ordens de Serviço</CardTitle>
                            <CardDescription>Gerencie os computadores em manutenção</CardDescription>
                        </div>
                        <TabsList className="flex w-auto h-9 hover:cursor-pointer">
                            <TabsTrigger className="text-xs px-3 hover:cursor-pointer" value="todos">TODOS</TabsTrigger>
                            <TabsTrigger className="text-xs px-3 hover:cursor-pointer" value="andamento">EM ANDAMENTO</TabsTrigger>
                            <TabsTrigger className="text-xs px-3 hover:cursor-pointer" value="pecas">PEÇAS</TabsTrigger>
                            <TabsTrigger className="text-xs px-3 hover:cursor-pointer" value="prontos">PRONTOS</TabsTrigger>
                            <TabsTrigger className="text-xs px-3 hover:cursor-pointer" value="baixados">BAIXADOS</TabsTrigger>
                        </TabsList>
                    </div>
                </CardHeader>

                <CardContent>
                    <TabsContent value="todos">
                        {renderContent(null)}
                    </TabsContent>

                    <TabsContent value="andamento">
                        {renderContent("ANDAMENTO")}
                    </TabsContent>

                    <TabsContent value="pecas">
                        {renderContent("PECAS")}
                    </TabsContent>

                    <TabsContent value="prontos">
                        {renderContent("PRONTO")}
                    </TabsContent>

                    <TabsContent value="baixados">
                        {renderContent("BAIXADO")}
                    </TabsContent>

                </CardContent>
                <CardFooter>
                    {/*TODO: ADICIONAR PAGINIÇÃO AQUI  */}
                </CardFooter>
            </Card>
        </Tabs>
    )
}