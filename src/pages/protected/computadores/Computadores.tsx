import FormComputadores from "@/componentsRob/Forms/FormComputador";
import PageHeader from "@/componentsRob/Globals/PageHeader";
import PainelComputadores from "@/componentsRob/Painels/PainelComputadores";
import TableComputador from "@/componentsRob/Tables/TableComputer";
import { Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/services/api"

export default function ComputadoresPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [valuesCards, setValuesCards] = useState({
    totalComputadores: 0,
    totalAtivos: 0,
    totalManutencao: 0,
    totalInativos: 0,
  });


  const fetchValuesCards = async () => {
    try {
      const response = await api.get("/computador/infos");

     

      const data =  response.data ;

      setValuesCards({
        totalComputadores: data.totalComputadores,
        totalAtivos: data.totalAtivos,
        totalManutencao: data.totalManutencao,
        totalInativos: data.totalInativos,
      });
    } catch (error) {
      console.error("Erro ao carregar dados do painel:", error);
    }
  };


  
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchValuesCards();
    
  }, []);

  
  const handleCloseModal = (shouldRefresh = false) => {
    setIsFormOpen(false);

    if (shouldRefresh) {
      fetchValuesCards();
     
    }
  };

  return (
    <>
      <PageHeader
       icon={Monitor}
        title="Cadastro de Computadores"
        description="Gerencie o inventário de computadores e suas localizações"
        buttonText="Adicionar Computador"
        onClickButtonHeader={() => setIsFormOpen(true)}
      />

      <PainelComputadores  data={valuesCards} />

      {isFormOpen &&(
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <FormComputadores onClose={handleCloseModal} />
      </div>)
}
      <TableComputador/>
    </>
  ); 
}
