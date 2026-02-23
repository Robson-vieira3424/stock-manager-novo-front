import FormManutencao from "@/componentsRob/Forms/FormManutencao";
import PageHeader from "@/componentsRob/Globals/PageHeader";
import PainelManutencao from "@/componentsRob/Painels/PainelManutencao";
import PainelOs from "@/componentsRob/Painels/PainelOS";
import Progresso from "@/componentsRob/Progress/BarraDeProgresso";
import { manutecaoDTO } from "@/types/manutencaoDTO";
import { Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/services/api"

export default function ManutencaoPage() {
    const [modalAberto, setModalAberto] = useState(false);
    const [loading, setLoading] = useState(false)
    const [manutencoes, setManutencoes] = useState<manutecaoDTO[]>([]);

    async function getManutencoes() {

        try {
            setLoading(true);
            const response = await api.get("/manutencao");
            setManutencoes(response.data);
            console.log("manutenções chegando: ", response.data);
        } catch (error) {
            console.log("Erro ao buscar manutencoes", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getManutencoes();
    }, [])
    return (
        <>
            <PageHeader
                title="Manutenção"
                description="Acompanhe e Gerencie as Manutenções do departamento"
                icon={Wrench}
                buttonText="Criar Manutenção"
                onClickButtonHeader={() => setModalAberto(true)}
            />

            <PainelManutencao
            />
            <Progresso
            />

            <FormManutencao
                open={modalAberto}
                onOpenChange={setModalAberto}
            />


            <PainelOs data={manutencoes}
            />
        </>

    )
}