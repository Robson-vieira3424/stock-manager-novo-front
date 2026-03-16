import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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

const CustomTick = ({ x, y, payload }: any) => {
    const words = payload.value.split(" ");
    const lines: string[] = [];
    let line = "";

    for (const word of words) {
        if ((line + word).length > 10) {
            lines.push(line.trim());
            line = word + " ";
        } else {
            line += word + " ";
        }
    }
    if (line.trim()) lines.push(line.trim());

    return (
        <g transform={`translate(${x},${y})`}>
            {lines.map((l, i) => (
                <text
                    key={i}
                    x={0}
                    y={0}
                    dy={i * 14 + 10}
                    textAnchor="middle"
                    fill="#6b7280"
                    fontSize={11}
                >
                    {l}
                </text>
            ))}
        </g>
    );
};

export function SecretariasGraph({ data }: Props) {
    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className="pb-2">
                <CardTitle>Saídas por Secretaria</CardTitle>
                <CardDescription>Acompanhe os departamentos com mais entregas de equipamentos</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <ChartContainer config={chartConfig} className="h-[240px] w-full">
                    <BarChart accessibilityLayer data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="secretaria"
                            tickLine={false}
                            axisLine={false}
                            interval={0}
                            height={60}
                            tick={<CustomTick />}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={{ stroke: "#d1d5db", strokeWidth: 2 }}
                            tickMargin={8}
                            width={30}
                            tickFormatter={(value) => String(value)}
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