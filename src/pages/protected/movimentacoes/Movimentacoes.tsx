import FormMoviments from "@/componentsRob/Forms/FormMovimentacao";
import PageHeader from "@/componentsRob/Globals/PageHeader";
import MovementsPainel from "@/componentsRob/Painels/PainelMoviments";
import MovimentsTable from "@/componentsRob/Tables/MovimentsTable";
import { InfoCardasMoviments } from "@/types/InfoCardMoviments";
import { ActivityIcon } from "lucide-react";
import api from "../../../services/api"
import {  useEffect, useState } from "react";

export default function MovimentacoesPage() {

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [infoCards, setInfoCards] = useState<InfoCardasMoviments | null>(null);



    const handleCloseForm = () => {
        setIsFormOpen(false);
    };

    async function getInfoCards() {

        try {
            const response = await api.get("moviments/info");

            setInfoCards(response.data);
           
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        getInfoCards();
    }, []);

    return (
        <>
            <PageHeader
                onClickButtonHeader={() => setIsFormOpen(true)}
                description="Histórico de entradas e saídas"
                title="Movimentações"
                buttonText="Adicionar Movimentação"
                icon={ActivityIcon}/>

           <MovementsPainel 
                entradas={infoCards?.totalEntradas ?? 0} 
                totalItens={infoCards?.total ?? 0} 
                recentes={infoCards?.totalRecentes ?? 0} 
                saidas={infoCards?.totalSaidas ?? 0}
            />
            <MovimentsTable/>
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    {/* O formulário em si */}
                    <FormMoviments onClose={handleCloseForm} />
                </div>
            )}
        </>
    )
}