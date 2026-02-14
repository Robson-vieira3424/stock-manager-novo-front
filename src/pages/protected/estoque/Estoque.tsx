import FormProduct from "@/componentsRob/Forms/FormProduct";
import PageHeader from "@/componentsRob/Globals/PageHeader";
import PainelCards from "@/componentsRob/Painels/PainelCards";

import ProductTable from "@/componentsRob/Tables/TableProducts";
import { CardsProducts } from "@/types/cardsProducts";
import { Box } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/services/api";

export default function EstoquePage() {

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [dataPainelProducts, setDataPainelProducts] = useState<CardsProducts | null>(null)
    const [isLoading, setIsLoading] = useState(false);

    const handleCloseForm = () => {
        setIsFormOpen(false);
        getInfoPainelProducts();
    }

    async function getInfoPainelProducts() {
        setIsLoading(true);
       
       try {
            const response = await api.get("/product/infos");
            setDataPainelProducts(response.data);
            
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            if (error.response?.status === 403) {
                alert("Sessão expirada ou sem permissão.");
            }
        } finally {
            // 3. O 'finally' roda SEMPRE, dando erro ou sucesso
            setIsLoading(false); 
        }
    }
    useEffect(() => {
        getInfoPainelProducts();
    }, [])
    return (
        <>
            <PageHeader icon={Box}
                onClickButtonHeader={() => setIsFormOpen(true)}
                description="Departamento de Patrimônio - Prefeitura Municipal"
                title="Estoque de Produtos"
                buttonText="Adicionar" />

            <PainelCards dados={dataPainelProducts} isLoading={isLoading}></PainelCards>
            {isFormOpen &&
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <FormProduct onClose={handleCloseForm} />
                </div>}

            <ProductTable/>
        </>
    );
}