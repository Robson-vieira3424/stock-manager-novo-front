import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ElementType } from "react";

interface cardsProps {
    icone: ElementType;
    titulo: string;
    qtd: string;
    desc: string;
    color?: string;
}

export default function GenericCards({ icone: Icon, titulo, qtd, desc, color }: cardsProps) {
    return (
        <Card 
            className="
                w-full md:w-1/4 h-[180px]
                
                /* Remove a borda padrão do shadcn se quiser igual ao original, ou mantenha border-border */
                border-transparent 
                
                /* Sombra Inicial */
                shadow-[1px_1px_8px_rgba(0,0,0,0.32)]
                
                /* Configuração da Animação */
                transition-all duration-[250ms] ease-out
                
                /* Efeitos de Hover (Movimento e Sombra Azulada) */
                hover:-translate-y-1.5 
                hover:shadow-[2px_6px_14px_rgba(173,216,230,0.55)]
            "
        >
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-zinc-500 text-[15px] font-medium">
                    {titulo}
                </CardTitle>
            </CardHeader>
            
            <CardContent>
                <p className="font-bold text-3xl" style={{ color }}>
                    {qtd}
                </p>
            </CardContent>
            
            <CardFooter>
                <p className="text-zinc-500 text-[14px]">
                    {desc}
                </p>
            </CardFooter>
        </Card>
    )
}