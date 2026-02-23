import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Cpu, MapPin } from "lucide-react";
import { Departamento } from "@/types/departamento";

interface PcLocalProps {
    departamento: Departamento;
}

export default function PcLocal({ departamento }: PcLocalProps) {
    return (
      
        <Card className="w-full md:w-[48%] lg:w-[30%] h-fit">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Monitor className="h-6 w-6" />
                </div>

                <section>
                    <CardTitle className="text-lg uppercase">
                        {departamento.nomeDepartamento}
                    </CardTitle>
                    <CardDescription>
                        {departamento.estacoes.length} computador(es)
                    </CardDescription>
                </section>
            </CardHeader>

            <CardContent className="flex flex-col gap-3 pt-4">
                {departamento.estacoes.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center italic py-2">
                        Nenhum equipamento neste setor.
                    </p>
                ) : (
                    departamento.estacoes.map((estacao) => (
                        <div
                            key={estacao.id}
                            className="border border-zinc-200 rounded-md overflow-hidden bg-white cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/20"
                        >

                            {/* Parte Superior: Ícone, Nome, Status e Specs */}
                            <div className="p-3">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-3 overflow-hidden">
                                        {/* Ícone do PC */}
                                        <div className="mt-1 flex-shrink-0">
                                            <Monitor className="h-5 w-5 text-zinc-500" />
                                        </div>

                                        <div className="min-w-0"> {/* min-w-0 ajuda no truncate do texto */}
                                            {/* Nome do PC */}
                                            <p className="font-semibold text-sm mb-2 truncate text-zinc-800" title={estacao.nomeComputador}>
                                                {estacao.nomeComputador || "Sem Nome"}
                                            </p>

                                            {/* Specs (Abaixo do nome) */}
                                            <div className="flex flex-col gap-1 text-xs text-zinc-500">
                                                {/* Processador */}
                                                <div className="flex items-center gap-2">
                                                    <Cpu className="h-3.5 w-3.5 flex-shrink-0" />
                                                    <span className="truncate">{estacao.processador || "Proc. N/A"}</span>
                                                </div>

                                                {/* Localização (Já que o DTO tem localizacao, substitui a RAM por enquanto) */}
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                                    <span className="truncate">{estacao.localizacao}</span>
                                                </div>

                                                {/* Memória e HD (Descomente se adicionar ao DTO no futuro) */}
                                                {/* <div className="flex items-center gap-2">
                                                    <MemoryStick className="h-3.5 w-3.5" />
                                                    <span>8GB DDR4</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <HardDrive className="h-3.5 w-3.5" />
                                                    <span>SSD 240GB</span>
                                                </div> 
                                                */}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status (Canto superior direito) */}
                                    {/* Como o DTO Resumo não tem status, deixei fixo ou você pode adicionar lógica */}
                                    <span className="flex-shrink-0 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                        Ativo
                                    </span>
                                </div>
                            </div>

                            {/* Linha Divisória */}
                            <div className="border-t border-zinc-200"></div>

                            {/* Footer: ID e Data (Extremidades) */}
                            <div className="flex justify-between items-center bg-zinc-50/50 p-2 px-3 text-xs text-zinc-500">
                                <span className="font-medium">ID: <span className="text-zinc-700">{estacao.id}</span></span>
                                {/* Data fake ou remover se não tiver no DTO */}
                                <span>Manut: <span className="text-zinc-700">--/--/--</span></span>
                            </div>

                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}