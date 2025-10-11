
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Line, LineChart } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';

const chartData = [{ v: 20 }, { v: 10 }, { v: 30 }, { v: 25 }, { v: 40 }, { v: 35 }, { v: 50 }];

const chartConfig = {
  revenue: {
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function RevenueChart() {
  return (
    <Card className="flex flex-col flex-1">
      <CardHeader className="pb-2">
        <CardDescription>Archivos Centralizados</CardDescription>
        <CardTitle className="text-4xl">1,523</CardTitle>
        <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col justify-end">
        <ChartContainer config={chartConfig} className="w-full h-14">
          <LineChart accessibilityLayer data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <Line dataKey="v" type="natural" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
