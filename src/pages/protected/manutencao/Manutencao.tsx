import FormManutencao from "@/componentsRob/Forms/FormManutencao";
import PageHeader from "@/componentsRob/Globals/PageHeader";
import PainelManutencao from "@/componentsRob/Painels/PainelManutencao";
import PainelOs from "@/componentsRob/Painels/PainelOS";
import Progresso from "@/componentsRob/Progress/BarraDeProgresso";
import { manutecaoDTO } from "@/types/manutencaoDTO";
import { Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/services/api"
import FormAtualizarManutencao from "@/componentsRob/Forms/FormAtualizarManutencao";
import FormVisualizarManutencao from "@/componentsRob/Forms/FormVisualizarManutencao";
import { CardsManutencao } from "@/types/cardsManutecao";
import ProgressDTO from "@/types/progress";

export default function ManutencaoPage() {
    const [modalAberto, setModalAberto] = useState(false);
    const [loading, setLoading] = useState(false)
    const [manutencoes, setManutencoes] = useState<manutecaoDTO[]>([]);
    const [modalVisualizarAberto, setModalVisualizarAberto] = useState(false);
    const [manutencaoEmVisualizacao, setManutencaoEmVisualizacao] = useState<manutecaoDTO | null>(null);
    const [modalAtualizarAberto, setModalAtualizarAberto] = useState(false);
    const [manutencaoEmEdicao, setManutencaoEmEdicao] = useState<manutecaoDTO | null>(null);
    const [infoCards, setInfoCards] = useState<CardsManutencao | null>(null);
    const [taxaRecuperacao, setTaxaRecuperacao] = useState<ProgressDTO>();
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

    const handleEditManutencao = (id: number) => {
        console.log("1. Clicou no lápis! ID recebido:", id);

      
        const manutencaoParaEditar = manutencoes.find(m => String(m.id) === String(id));

        console.log("2. Achou a manutenção?", manutencaoParaEditar);

        if (manutencaoParaEditar) {
            setManutencaoEmEdicao(manutencaoParaEditar);
            setModalAtualizarAberto(true);
            console.log("3. Estado atualizado, modal deve abrir!");
        } else {
            alert("Manutenção não encontrada na memória do painel.");
        }
    };

    const handleViewManutencao = (id: number) => {
        const manutencaoParaVer = manutencoes.find(m => String(m.id) === String(id));
        if (manutencaoParaVer) {
            setManutencaoEmVisualizacao(manutencaoParaVer);
            setModalVisualizarAberto(true);
        }
    };
    async function handleTaxaRecuperacao() {
        try{
        setLoading(true);
        const response = await api.get("/manutencao/taxaRecuperacao");
        setTaxaRecuperacao(response.data);
        console.log("Taxa de recuperação atual :", response.data);
    }catch(error){
        console.log("Erro ao buscar Taxa de recuperação :", error);
    }
    finally{
        setLoading(false);
    }
}

    async function handleInfoCards() {
        try{
            setLoading(true);
            const response = await api.get("/manutencao/infoPainel");
            setInfoCards(response.data);
        }catch(error){
            console.log("Erro ao buscar informações dos cards de manutenções: ", error);
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        getManutencoes();
        handleInfoCards();
        handleTaxaRecuperacao();
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

            <PainelManutencao data={infoCards}
            />
           
            {taxaRecuperacao && <Progresso data={taxaRecuperacao} />}

            <FormManutencao
                open={modalAberto}
                onOpenChange={setModalAberto}
            />
            <FormAtualizarManutencao
                open={modalAtualizarAberto}
                onOpenChange={setModalAtualizarAberto}
                manutencao={manutencaoEmEdicao}
                onSuccess={getManutencoes} 
            />

            <FormVisualizarManutencao
                open={modalVisualizarAberto}
                onOpenChange={setModalVisualizarAberto}
                manutencao={manutencaoEmVisualizacao}
            />

            {/* <-- REPASSANDO A PROP onView --> */}
            <PainelOs
                data={manutencoes}
                onEdit={handleEditManutencao}
                onView={handleViewManutencao}
            />
        </>

    )
}