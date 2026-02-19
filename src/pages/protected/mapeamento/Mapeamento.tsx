import CardSecretaria from "@/componentsRob/Cards/CardSecretaria";
import FormSecretaria from "@/componentsRob/Forms/FormSecretaria";
import PageHeader from "@/componentsRob/Globals/PageHeader";
import { Secretaria } from "@/types/secretaria";
import api from "@/services/api"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Building2,
    Stethoscope,
    GraduationCap,
    ShieldCheck,
    Leaf,
    Truck,
    MapPinned
} from "lucide-react";

const iconMap: Record<string> = {
    "Saúde": Stethoscope,
    "Educação": GraduationCap,
    "Segurança": ShieldCheck,
    "Meio Ambiente": Leaf,
    "Obras": Truck,
    
    "default": Building2
};
export default function MapeamentoPage() {
    const [IsformOpen, setIsFormOpen] = useState(false);
    const[loading, setLoading] = useState(false);
    const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
    const navigate = useNavigate();

    async function getSecretarias(){
        setLoading(true);
        
        try{
            const response = await api.get("/secretaria");
            console.log("Secretarias vindo do back: ", response.data);
            setSecretarias(response.data);
        }
        catch(erro){
            console.log("Erro ao buscar Secretarias :",erro)
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        getSecretarias();
    },[])

    function handleNavigate(id: number | undefined) {
        if (id) {
            navigate(`/mapeamento/${id}`);
        } else {
            console.error("ID da secretaria inválido");
        }
    }
 return (<>
        <PageHeader
            icon={MapPinned}
            buttonText="Adicionar"
            title="Mapeamento"
            description="Visualize o inventário de equipamentos por secretaria e departamento"
            onClickButtonHeader={() => setIsFormOpen(!IsformOpen)} />

     {IsformOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
             <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
                 
                     <FormSecretaria onClose={() => setIsFormOpen(false)} />
                 
             </div>
         </div>
     )}
        
     <div className="p-6">
         {loading ? (
             <p>Carregando secretarias...</p>
         ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                     {secretarias.map((sec, index) => (
                         // Envolvemos o Card em uma DIV clicável
                         <div
                             key={index}
                             onClick={() => handleNavigate(sec.id)}
                             className="cursor-pointer hover:opacity-80 transition-opacity"
                         >
                             <CardSecretaria
                                 nome={sec.nome}
                                 subtile={sec.subtile}
                                 icon={iconMap[sec.nome] || iconMap.default}
                             />
                         </div>
                     ))}
                 </div>
         )}

         {secretarias.length === 0 && !loading && (
             <div className="text-center py-10 text-muted-foreground">
                 Nenhuma secretaria encontrada.
             </div>
         )}
     </div>
    </>
    )
}