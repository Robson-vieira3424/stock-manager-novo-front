import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/services/api";

type EstoqueStatus = {
    normal: number;
    baixo: number;
    semEstoque: number;
};

export default function EstoqueGraphsBar() {
    const [dados, setDados] = useState<EstoqueStatus>({ normal: 0, baixo: 0, semEstoque: 0 });
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        api.get<EstoqueStatus>("/dashboard/estoque-status")
            .then(res => {
                // Reseta para 0 primeiro
                setAnimating(false);
                setDados(res.data);
                // Pequeno delay para o browser processar o reset antes de animar
                setTimeout(() => setAnimating(true), 50);
            })
            .catch(err => console.error("Erro estoque status:", err));
    }, []);

    const total = dados.normal + dados.baixo + dados.semEstoque || 1;

    const barras = [
        {
            label: "Estoque Normal",
            percentual: Math.round((dados.normal / total) * 100),
            cor: "bg-green-500",
            delay: "delay-[200ms]",
        },
        {
            label: "Estoque Baixo",
            percentual: Math.round((dados.baixo / total) * 100),
            cor: "bg-orange-400",
            delay: "delay-[350ms]",
        },
        {
            label: "Sem Estoque",
            percentual: Math.round((dados.semEstoque / total) * 100),
            cor: "bg-red-500",
            delay: "delay-[500ms]",
        },
    ];

    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className="pb-2">
                <CardTitle>Status do Estoque</CardTitle>
                <CardDescription>Acompanhe o nível do estoque em tempo real</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <div className="h-[240px] flex flex-col justify-center space-y-6">
                    {barras.map((barra) => (
                        <div key={barra.label} className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-gray-700">{barra.label}</span>
                                <span className="text-xs text-muted-foreground">{barra.percentual}%</span>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-gray-100">
                                <div
                                    className={`h-2.5 rounded-full transition-all duration-700 ease-in-out ${barra.cor} ${barra.delay}`}
                                    style={{ width: animating ? `${barra.percentual}%` : "0%" }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}