import { useEffect, useState } from "react"
import PageHeader from "@/componentsRob/Globals/PageHeader"
import { LayoutDashboard } from "lucide-react"
import { MovimentacoeGraph } from "@/componentsRob/Graphs/MovimentacoesGraph"
import { SecretariasGraph } from "@/componentsRob/Graphs/SecretatiasGraph"
import api from "@/services/api"
import EstoqueGraphsBar from "@/componentsRob/Graphs/EstoqueGraphsBar"
import UltimasManutencoes from "@/componentsRob/Graphs/CardUltimasMovimentacoes"

type MesData = {
    mes: string
    entradas: number
    saidas: number
}

type SecretariaData = {
    secretaria: string
    saidas: number
}

export default function DashboardPage() {
    const [movimentacoes, setMovimentacoes] = useState<MesData[]>([])
    const [secretariasSaidas, setSecretariasSaidas] = useState<SecretariaData[]>([])

    useEffect(() => {
        api.get<MesData[]>("/dashboard/por-mes")
            .then(res => setMovimentacoes(res.data))
            .catch(err => console.error("Erro movimentações:", err))

        api.get<SecretariaData[]>("/dashboard/secretarias-saidas")
            .then(res => {
                console.log("🏢 Secretarias saídas:", res.data)
                setSecretariasSaidas(res.data)
            })
            .catch(err => console.error("Erro secretarias:", err))
    }, [])

    return (
        <>
            <PageHeader
                title="Dashboard"
                description="Visão geral do sistema"
                icon={LayoutDashboard}
            />
            <div className="grid grid-cols-2 gap-4 py-4">
                <MovimentacoeGraph data={movimentacoes} key={`mov-${movimentacoes.length}`} />
                <SecretariasGraph data={secretariasSaidas} key={`sec-${secretariasSaidas.length}`} />
                <UltimasManutencoes/>
                <EstoqueGraphsBar />
              
            </div>
        </>
    )
}