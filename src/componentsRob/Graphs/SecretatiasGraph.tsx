
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart"

type SecretariaData = {
    secretaria: string
    saidas: number
}

type Props = {
    data: SecretariaData[]
}

const chartConfig = {
    saidas: { label: "Saídas", color: "#0080FF" },
} satisfies ChartConfig

export function SecretariasGraph({ data }: Props) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Saídas por Secretaria</CardTitle>
                <CardDescription>Acompanhe os dempartamentos com mais entregas de equipamentos</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} style={{ overflow: "visible" }}>
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="secretaria"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            angle={-25}
                            textAnchor="end"
                            height={60}
                            interval={0}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar
                            dataKey="saidas"
                            fill="var(--color-saidas)"
                            radius={8}
                            isAnimationActive={true}
                            animationBegin={0}
                            animationDuration={2000}
                            animationEasing="ease-in-out"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            
        </Card>
    )
}