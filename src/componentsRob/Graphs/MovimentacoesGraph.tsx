import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart"

type MesData = {
    mes: string
    entradas: number
    saidas: number
}

type Props = {
    data: MesData[]
}

const chartConfig = {
    entradas: { label: "Entradas", color: "#0080FF" },
    saidas: { label: "Saídas", color: "#EF4444" },
} satisfies ChartConfig

export function MovimentacoeGraph({ data }: Props) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Movimentações por Mês</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart data={data} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="mes"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Line
                            dataKey="entradas"
                            type="monotone"
                            stroke="var(--color-entradas)"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "var(--color-entradas)" }}
                            activeDot={{ r: 6 }}
                            isAnimationActive={true}
                            animationBegin={0}
                            animationDuration={1500}
                            animationEasing="ease-in-out"
                        />
                        <Line
                            dataKey="saidas"
                            type="monotone"
                            stroke="var(--color-saidas)"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "var(--color-saidas)" }}
                            activeDot={{ r: 6 }}
                            isAnimationActive={true}
                            animationBegin={300}
                            animationDuration={1500}
                            animationEasing="ease-in-out"
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
                Entradas e saídas de estoque nos últimos 6 meses
            </CardFooter>
        </Card>
    )
}