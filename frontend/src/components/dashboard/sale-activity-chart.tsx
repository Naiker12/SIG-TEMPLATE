
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';

const chartData = [
  { month: 'Ene', processed: 186, errors: 80 },
  { month: 'Feb', processed: 305, errors: 200 },
  { month: 'Mar', processed: 237, errors: 120 },
  { month: 'Abr', processed: 73, errors: 190 },
  { month: 'May', processed: 209, errors: 130 },
  { month: 'Jun', processed: 214, errors: 140 },
];

const chartConfig = {
  processed: {
    label: 'Procesados',
    color: 'hsl(var(--chart-1))',
  },
  errors: {
    label: 'Errores',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function SaleActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad de Procesamiento - Mensual</CardTitle>
        <CardDescription>Mostrando documentos procesados y errores de los últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id="fillProcessed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-processed)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-processed)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillErrors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-errors)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-errors)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="errors"
              type="natural"
              fill="url(#fillErrors)"
              fillOpacity={0.4}
              stroke="var(--color-errors)"
              stackId="a"
            />
            <Area dataKey="processed" type="natural" fill="url(#fillProcessed)" fillOpacity={0.4} stroke="var(--color-processed)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
