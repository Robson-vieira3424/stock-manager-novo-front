import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
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
        <Card className="w-full overflow-hidden">
            <CardHeader className="pb-2">
                <CardTitle>Movimentações por Mês</CardTitle>
                <CardDescription>Entradas e saídas de estoque nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <ChartContainer config={chartConfig} className="h-[240px] w-full">
                    <LineChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="mes"
                            tickLine={false}
                            axisLine={{ stroke: "#d1d5db", strokeWidth: 2 }}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={{ stroke: "#d1d5db", strokeWidth: 2 }}
                            tickMargin={8}
                            width={30}
                            tickFormatter={(value) => String(value)}
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
        </Card>
    )
}