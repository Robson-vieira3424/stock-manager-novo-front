import { Activity, Calendar, CircleArrowDown, CircleArrowUp } from "lucide-react";
import GenericCards from "../Globals/GenericCard";


interface valeuCardsMoviemnts {
    totalItens: number;
    entradas: number;
    saidas: number;
    recentes: number
}
export default function MovementsPainel({ totalItens, entradas, saidas, recentes }: valeuCardsMoviemnts) {
    return (
        <div className="flex gap-2">
            <GenericCards titulo="Total Movimentações" icone={Activity} qtd={String(totalItens)} desc="registros no sistema" />
            <GenericCards titulo="Entradas" icone={CircleArrowDown} qtd={String(entradas)} desc=" itens recebidos" color="#21C45D" />
            <GenericCards titulo="Saídas" icone={CircleArrowUp} qtd={String(saidas)} desc="itens distribuídos" color="#0080FF" />
            <GenericCards titulo="Recentes" icone={Calendar} qtd={String(recentes)} desc="últimos 7 dias" color="#F59F0A"/>

        </div>
    )
}