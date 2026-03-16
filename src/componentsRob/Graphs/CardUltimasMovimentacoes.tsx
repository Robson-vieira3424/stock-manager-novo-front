import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/services/api";

type MovimentacaoRecente = {
    nomeProduto: string;
    secretaria: string;
    tipo: "ENTRADA" | "SAIDA";
};

export default function UltimasMovimentacoes() {
    const [movimentacoes, setMovimentacoes] = useState<MovimentacaoRecente[]>([]);

    useEffect(() => {
        api.get<MovimentacaoRecente[]>("/dashboard/movimentacoes-recentes")
            .then(res => setMovimentacoes(res.data))
            .catch(err => console.error("Erro movimentações recentes:", err));
    }, []);

    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className="pb-2">
                <CardTitle>Movimentações Recentes</CardTitle>
            </CardHeader>
            <CardContent className="pb-0 px-0">
                <div className="flex flex-col">
                    {movimentacoes.map((mov, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between px-6 py-3 border-t first:border-t-0"
                        >
                            
                            <div className="space-y-0.5">
                                <p className="text-[16px] font-semibold text-gray-900">
                                    {mov.nomeProduto}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {mov.secretaria}
                                </p>
                            </div>

                            
                            <span
                                className={`text-sm font-semibold ${mov.tipo === "ENTRADA"
                                        ? "text-green-500"
                                        : "text-[#0080FF]"
                                    }`}
                            >
                                {mov.tipo === "ENTRADA" ? "Entrada" : "Saída"}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}