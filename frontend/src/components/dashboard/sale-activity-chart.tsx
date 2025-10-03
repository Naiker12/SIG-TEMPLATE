
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';

const chartData = [
  { month: 'Jan', sales: 186, subscriptions: 80 },
  { month: 'Feb', sales: 305, subscriptions: 200 },
  { month: 'Mar', sales: 237, subscriptions: 120 },
  { month: 'Apr', sales: 73, subscriptions: 190 },
  { month: 'May', sales: 209, subscriptions: 130 },
  { month: 'Jun', sales: 214, subscriptions: 140 },
];

const chartConfig = {
  sales: {
    label: 'Sales',
    color: 'hsl(var(--chart-1))',
  },
  subscriptions: {
    label: 'Subscriptions',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function SaleActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sale Activity - Monthly</CardTitle>
        <CardDescription>Showing total sales for the last 6 months</CardDescription>
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
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-sales)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-sales)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillSubscriptions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-subscriptions)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-subscriptions)" stopOpacity={0.1} />
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
              dataKey="subscriptions"
              type="natural"
              fill="url(#fillSubscriptions)"
              fillOpacity={0.4}
              stroke="var(--color-subscriptions)"
              stackId="a"
            />
            <Area dataKey="sales" type="natural" fill="url(#fillSales)" fillOpacity={0.4} stroke="var(--color-sales)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
