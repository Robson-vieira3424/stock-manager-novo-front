import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import ProgressDTO from "@/types/progress";
import { TrendingUp } from "lucide-react"

interface taxaRecuperacaoProps {
    data: ProgressDTO;
}

export default function Progresso({ data }: taxaRecuperacaoProps) {

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex gap-2 text-[24px] items-center">
                    <TrendingUp size={20} /> Taxa de Recuperação de Equipamentos
                </CardTitle>
                <CardDescription>
                    Percentual de equipamentos que retornam ao funcionamento após manutenção
                </CardDescription>
            </CardHeader>

            <CardContent className="w-full">
                <div className="w-full space-y-2">
                    <div className="flex justify-between text-sm">
                        <Label htmlFor="progress-upload">Recuperados vs Baixados</Label>
                        <span className="ml-auto font-semibold text-blue-600">{data.taxa}%</span>
                    </div>
                    <Progress value={data.taxa} id="progress-upload" className="w-full h-3.5 [&>*]:bg-blue-600 bg-gray-200" />
                </div>
            </CardContent>

            <CardFooter className="flex justify-between pt-2 border-t border-slate-100">
                <span className="text-sm text-slate-500">{data.recuperados} equipamentos recuperados</span>
                <span className="text-sm text-slate-500">{data.baixas} equipamentos baixados</span>
            </CardFooter>
        </Card>
    )
}