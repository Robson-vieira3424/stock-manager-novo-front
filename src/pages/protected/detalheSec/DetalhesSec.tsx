import CardFooterSecId from "@/componentsRob/Cards/CardFooterSecId";
import PcLocal from "@/componentsRob/Cards/PcLocal";
import HeaderSecId from "@/componentsRob/Globals/HeaderSecId";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/services/api"
import { SecretariaHierarquia } from "@/types/secretariaHierarquia";
import FormDepartamento from "@/componentsRob/Forms/FormDepartamento";
export default function DetalhesSecretaria() {
    const { id } = useParams();
    const [secretaria, setSecretaria] = useState<SecretariaHierarquia | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const fetchDados = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            const response = await api.get(`/secretaria/computadores/${id}`);
            setSecretaria(response.data);
        } catch (error) {
            console.error("Erro ao buscar detalhes:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDados();
    }, [fetchDados]);
    
    if (loading) {
        return <div className="p-10 text-center">Carregando dados da secretaria...</div>;
    }

    if (!secretaria) {
        return <div className="p-10 text-center">Secretaria não encontrada.</div>;
    }
    return (<>
        <HeaderSecId nome={secretaria.nomeSecretaria}
            onAddClick={() => setIsModalOpen(true)}
         />
        <section className="w-full flex flex-wrap gap-6 items-start">
            {secretaria.departamentos.map((dept, index) => (
                <PcLocal key={index} departamento={dept} />
            ))}

            {secretaria.departamentos.length === 0 && (
                <p className="text-muted-foreground italic">Nenhum departamento cadastrado.</p>
            )}
        </section>

        <CardFooterSecId />

        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <FormDepartamento
                    secretariaId={id as string} // Passa o ID da URL pro form
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false); // Fecha o modal
                        fetchDados(); // Atualiza a tela com o novo departamento
                    }}
                />
            </div>
        )}
    </>)
}