
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
        <CardDescription>Subscriptions</CardDescription>
        <CardTitle className="text-4xl">+2350</CardTitle>
        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-20 w-full">
          <BarChart accessibilityLayer data={chartData}>
            <Bar dataKey="v" fill="var(--color-subscriptions)" radius={2} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
