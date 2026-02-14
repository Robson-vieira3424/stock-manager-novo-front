import { Box, FileText, TrendingUp, TriangleAlert } from "lucide-react";

import { CardsProducts } from "@/types/cardsProducts";
import GenericCards from "../Globals/GenericCard";

interface cardsProductsProps {
    dados: CardsProducts | null;
    isLoading?: boolean;
}
export default function PainelCards({ dados, isLoading }: cardsProductsProps) {
    if (isLoading || !dados) {
        return <div>Carregando métricas...</div>; // Ou um Skeleton
    }
    return (

        <div className="flex gap-4 flex-nowrap w-full ">
            {/* 2. Passe o nome do ícone na prop */}
            <GenericCards
                icone={Box}
                titulo="Total de Itens"
                qtd={dados.totalItens.toString()}
                desc="Itens em estoque"
            />
            <GenericCards
                icone={TrendingUp}
                titulo="Unidades Disponíveis"
                qtd={dados.unidadesDisponiveis.toString()}
                desc="unidades em estoque"
            />
            <GenericCards
                icone={FileText}
                titulo="Itens Disponíveis"
                qtd={dados.itensDisponiveis.toString()}
                desc="com estoque > 0"
                color="#21C45D"
            />
            <GenericCards
                icone={TriangleAlert}
                titulo="Estoque Baixo"
                qtd={dados.estoqueBaixo.toString()}
                desc="itens com estoque baixo"
                color="#F59F0A"
            />
        </div>

    )
}