import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Wifi } from "lucide-react";

export default function CardFooterSecId() {
    return (
        // Adicionado 'flex flex-col' para o gap funcionar
        <Card className="flex flex-col p-4 gap-4">

            <CardTitle className="flex gap-2 items-center">
                <Wifi className="w-6 h-6" /> {/* Defini um tamanho fixo para o ícone evitar distorção */}
                <h1 className="text-2xl font-semibold">Estatísticas Gerais</h1>
            </CardTitle>

            {/* Adicionado 'p-0' para remover o padding padrão do componente e alinhar com o título */}
            <CardContent className="p-0 grid grid-cols-2 md:grid-cols-4 gap-4">
                <section className="flex flex-col">
                    <p className="text-sm text-muted-foreground">Total de pcs</p>
                    <p className="text-3xl font-bold">0</p>
                </section>

                <section className="flex flex-col">
                    <p className="text-sm text-muted-foreground">Ativos</p>
                    <p className="text-green-500 text-3xl font-bold">0</p>
                </section>

                <section className="flex flex-col">
                    <p className="text-sm text-muted-foreground">Em Manutenção</p>
                    <p className="text-yellow-500 text-3xl font-bold">0</p>
                </section>

                <section className="flex flex-col">
                    <p className="text-sm text-muted-foreground">Salas</p>
                    <p className="text-3xl font-bold">0</p>
                </section>
            </CardContent>
        </Card>
    );
}