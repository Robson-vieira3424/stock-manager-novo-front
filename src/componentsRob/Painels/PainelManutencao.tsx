import { Box, CircleCheck, CircleX, Clock4, Wrench } from "lucide-react";
import CardComputador from "../Cards/CardMenor";
import { CardsManutencao } from "@/types/cardsManutecao";
interface PainelManutencaoProps{
    data: CardsManutencao;
}
export default function PainelManutencao ({data}:PainelManutencaoProps) {
    return(
        <div className="flex gap-2">
            <CardComputador icon={<Wrench color="#0080FF"/>} subtitle="Total em Manutenção" quantity={data?.total} bgColor=""/>
            <CardComputador icon={<Clock4 color="#EAB308"/>} subtitle="Em Andamento" quantity={data?.andamento} bgColor=""/>
            <CardComputador icon={<Box color="#F97316"/> } subtitle="Aguardando Peças" quantity={data?.aguardandoPecas} bgColor=""/>
            <CardComputador icon={<CircleCheck  color="#22C55E"/>} subtitle="Prontos" quantity={data?.prontos} bgColor=""/>
            <CardComputador icon={<CircleX  color="#EF4444" />} subtitle="Baixados" quantity={data?.baixas} bgColor=""/>
        </div>
    )
}