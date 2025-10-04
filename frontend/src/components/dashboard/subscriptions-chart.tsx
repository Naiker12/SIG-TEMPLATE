
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';

const chartData = [
  { v: 120, c: 'hsl(var(--chart-1))' },
  { v: 80, c: 'hsl(var(--chart-2))' },
  { v: 150, c: 'hsl(var(--chart-1))' },
  { v: 90, c: 'hsl(var(--chart-2))' },
  { v: 180, c: 'hsl(var(--chart-1))' },
  { v: 100, c: 'hsl(var(--chart-2))' },
  { v: 130, c: 'hsl(var(--chart-1))' },
  { v: 160, c: 'hsl(var(--chart-2))' },
  { v: 110, c: 'hsl(var(--chart-1))' },
  { v: 70, c: 'hsl(var(--chart-2))' },
];

const chartConfig = {
  subscriptions: {
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function SubscriptionsChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Suscripciones</CardDescription>
        <CardTitle className="text-4xl">+2350</CardTitle>
        <p className="text-xs text-muted-foreground">+180.1% desde el mes pasado</p>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="w-full h-14">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <Bar dataKey="v" fill="var(--color-subscriptions)" radius={2} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
