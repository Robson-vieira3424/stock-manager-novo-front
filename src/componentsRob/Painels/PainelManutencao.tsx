import { Box, CircleCheck, CircleX, Clock4, Wrench } from "lucide-react";
import CardComputador from "../Cards/CardMenor";

export default function PainelManutencao () {
    return(
        <div className="flex gap-2">
            <CardComputador icon={<Wrench color="#0080FF"/>} subtitle="Total em Manutenção" quantity={3} bgColor=""/>
            <CardComputador icon={<Clock4 color="#EAB308"/>} subtitle="Em Andamento" quantity={5} bgColor=""/>
            <CardComputador icon={<Box color="#F97316"/> } subtitle="Aguardando Peças" quantity={7} bgColor=""/>
            <CardComputador icon={<CircleCheck  color="#22C55E"/>} subtitle="Prontos" quantity={8} bgColor=""/>
            <CardComputador icon={<CircleX  color="#EF4444" />} subtitle="Baixados" quantity={9} bgColor=""/>
        </div>
    )
}