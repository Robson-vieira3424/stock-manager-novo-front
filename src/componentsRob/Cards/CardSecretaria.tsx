import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, Building2, ChevronRight } from "lucide-react";

interface CardSecretariaProps {
    nome: string;
    icon?: LucideIcon;
    colorTheme?: ColorTheme;
}
interface ColorTheme {
    bg: string;
    text: string;
}
export default function CardSecretaria({ nome, icon: Icon = Building2, colorTheme }: CardSecretariaProps) {

    // Tema fallback caso não seja passado nenhum
    const currentTheme = colorTheme || { bg: "bg-primary/10", text: "text-primary" };

    return (
        <Card

            className="
                group relative z-10 cursor-pointer bg-white
                transition-all duration-300 ease-out
                hover:scale-[1.02] hover:-translate-y-1 hover:z-20
                hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)]
            "
        >

            <CardContent className="flex items-center gap-4 p-4 relative">
                <div className={`p-3 rounded-lg flex-shrink-0 ${currentTheme.bg} ${currentTheme.text} border border-current`}>
                    <Icon className="w-6 h-6" />
                </div>

                <div className="flex flex-col overflow-hidden">
                    <h3 className="font-semibold text-sm truncate">{nome}</h3>
                </div>

                <div className="flex flex-1 justify-end">
                    <ChevronRight className="text-muted-foreground" />
                </div>


                <div
                    className="
                        pointer-events-none absolute left-16 -bottom-5 z-50 
                        w-max max-w-[220px] whitespace-normal break-words
                        bg-zinc-800 text-white text-xs px-2.5 py-1.5 rounded-md shadow-lg
                        opacity-0 invisible transition-all duration-200 
                        group-hover:opacity-100 group-hover:visible group-hover:delay-[1000ms]
                    "
                >
                    {nome}
                </div>
            </CardContent>
        </Card>
    );
}