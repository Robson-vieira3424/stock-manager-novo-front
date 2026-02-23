import CardSecretaria from "@/componentsRob/Cards/CardSecretaria";
import FormSecretaria from "@/componentsRob/Forms/FormSecretaria";
import PageHeader from "@/componentsRob/Globals/PageHeader";
import { Secretaria } from "@/types/secretaria";
import api from "@/services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Building2,
    GraduationCap,
    ShieldCheck,
    Leaf,
    
    MapPinned,
    LucideIcon,
    Hospital,
    HardHat,
    Cross,
    BrushCleaning,
    Shield,
    Lightbulb,
    Megaphone,
    Plane,
    Trophy,
    Landmark
} from "lucide-react";

// 1. Array de palavras-chave para buscar dentro do nome da secretaria
const iconKeywords = [
    { keyword: "saude", icon: Cross },
    { keyword: "saúde", icon: Cross }, // Prevenindo com e sem acento
    { keyword: "educacao", icon: GraduationCap },
    { keyword: "educação", icon: GraduationCap },
    { keyword: "seguranca", icon: ShieldCheck },
    { keyword: "segurança", icon: ShieldCheck },
    { keyword: "meio ambiente", icon: Leaf },
    { keyword: "obras", icon: HardHat },
    { keyword: "upa", icon: Hospital },
    { keyword: "psf", icon: Hospital },
    { keyword: "limpeza", icon: BrushCleaning },
    { keyword: "previdencia", icon: Shield },
    { keyword: "previdência", icon: Shield  },
    { keyword: "iluminacao", icon: Lightbulb  },
    { keyword: "iluminação", icon: Lightbulb },
    { keyword: "comunicação", icon: Megaphone },
    { keyword: "comunicacao", icon: Megaphone },
    { keyword: "turismo", icon: Plane },
    { keyword: "esporte", icon: Trophy },
    { keyword: "esportes", icon: Trophy  },
    { keyword: "controladoria", icon: Landmark },

]; 

function getIconByNome(nome: string | undefined): LucideIcon {
    if (!nome) return Building2; 

    const nomeLower = nome.toLowerCase();
    const match = iconKeywords.find(item => nomeLower.includes(item.keyword));
    
    return match ? match.icon : Building2;
}


const colorThemes = [
    { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
    { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400" },
    { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
    { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400" },
    { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-600 dark:text-rose-400" },
    { bg: "bg-slate-100 dark:bg-slate-900/30", text: "text-slate-600 dark:text-slate-400" },
];

export default function MapeamentoPage() {
    const [IsformOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
    const navigate = useNavigate();

    async function getSecretarias() {
        setLoading(true);
        try {
            const response = await api.get("/secretaria");
            setSecretarias(response.data);
            console.log("secretarias chegando: ", response.data);
        } catch (erro) {
            console.log("Erro ao buscar Secretarias :", erro);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getSecretarias();
    }, []);

    function handleNavigate(id: number | undefined) {
        if (id) {
            navigate(`/mapeamento/${id}`);
        } else {
            console.error("ID da secretaria inválido");
        }
    }

    return (
        <>
            <PageHeader
                icon={MapPinned}
                buttonText="Adicionar"
                title="Mapeamento"
                description="Visualize o inventário de equipamentos por secretaria e departamento"
                onClickButtonHeader={() => setIsFormOpen(!IsformOpen)}
            />

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
                        {secretarias.map((sec, index) => {
                            // 3. Escolhendo a cor baseada no index/ID para manter a estabilidade (parece aleatório, mas não pisca)
                            const themeIndex = (sec.id || index) % colorThemes.length;
                            const selectedTheme = colorThemes[themeIndex];

                            return (
                                <div
                                    key={index}
                                    onClick={() => handleNavigate(sec.id)}
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    <CardSecretaria
                                        nome={sec.nomeSecretaria}
                                        icon={getIconByNome(sec.nomeSecretaria)}
                                        colorTheme={selectedTheme}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

                {secretarias.length === 0 && !loading && (
                    <div className="text-center py-10 text-muted-foreground">
                        Nenhuma secretaria encontrada.
                    </div>
                )}
            </div>
        </>
    );
}
