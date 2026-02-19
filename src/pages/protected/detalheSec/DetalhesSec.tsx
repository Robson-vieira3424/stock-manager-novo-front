import CardFooterSecId from "@/componentsRob/Cards/CardFooterSecId";
import PcLocal from "@/componentsRob/Cards/PcLocal";
import HeaderSecId from "@/componentsRob/Globals/HeaderSecId";
import { Secretaria } from "@/types/secretaria";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/services/api"
export default function DetalhesSecretaria() {
    const { id } = useParams();
    const [secretaria, setSecretaria] = useState<Secretaria | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDados() {
            try {

                const response = await api.get(`/secretaria/computadores/${id}`);
                setLoading(true);
                setSecretaria(response.data);
            } catch (error) {
                console.error("Erro ao buscar detalhes:", error);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchDados();
        }
    }, [id]);
    if (loading) {
        return <div className="p-10 text-center">Carregando dados da secretaria...</div>;
    }

    // 2. Se terminou de carregar, mas veio null ou deu erro
    if (!secretaria) {
        return <div className="p-10 text-center">Secretaria não encontrada.</div>;
    }
    return (<>
        <HeaderSecId nome={secretaria.nomeSecretaria} />
       
        <section className="w-full flex flex-wrap gap-6 items-start">
            {/* Loop para criar um Card por Departamento */}
            {secretaria.departamentos.map((dept, index) => (
                <PcLocal key={index} departamento={dept} />
            ))}

            {secretaria.departamentos.length === 0 && (
                <p className="text-muted-foreground italic">Nenhum departamento cadastrado.</p>
            )}
        </section>

        <CardFooterSecId />
    </>)
}