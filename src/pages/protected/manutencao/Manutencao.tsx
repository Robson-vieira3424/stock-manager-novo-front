import FormManutencao from "@/componentsRob/Forms/FormManutencao";
import PageHeader from "@/componentsRob/Globals/PageHeader";
import PainelManutencao from "@/componentsRob/Painels/PainelManutencao";
import Progresso from "@/componentsRob/Progress/BarraDeProgresso";
import { Wrench } from "lucide-react";
import { useState } from "react";

export default function ManutencaoPage() {
    const [modalAberto, setModalAberto] = useState(false);
    return (
        <>
            <PageHeader
                title="Manutenção"
                description="Acompanhe e Gerencie as Manutenções do departamento"
                icon={Wrench}
                buttonText="Criar Manutenção"
                onClickButtonHeader={() => setModalAberto(true)} /> 

            <PainelManutencao />
            <Progresso />

            <FormManutencao
                open={modalAberto}
                onOpenChange={setModalAberto} />
        </>
    )
}