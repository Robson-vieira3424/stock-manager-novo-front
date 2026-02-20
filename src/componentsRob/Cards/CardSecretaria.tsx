import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, Building2, ChevronRight } from "lucide-react";

interface CardSecretariaProps {
    nome: string;
   
    icon: LucideIcon;
}

export default function CardSecretaria({ nome, icon: Icon = Building2 }: CardSecretariaProps) {
    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer ">
            <CardContent className="flex items-center gap-4 p-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <h3 className="font-semibold text-sm truncate">{nome}</h3>
                </div>
                <div className="flex flex-1 justify-end">
                    <ChevronRight />
                </div>
            </CardContent>
        </Card>
    );
}