
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';
import type { ReactNode } from "react";
import { ChartContainer } from "../ui/chart";

type MetricCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  change: string;
  isPositive: boolean;
  chartData: number[];
}

export function MetricCard({ title, value, icon, change, isPositive, chartData }: MetricCardProps) {
  const changeColor = isPositive ? 'text-success' : 'text-destructive';
  const chartColor = isPositive ? 'hsl(var(--chart-2))' : 'hsl(var(--destructive))';
  
  const formattedChartData = chartData.map((v, i) => ({ x: i, y: v }));

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
             {icon} {title}
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Info className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-end justify-between gap-4">
            <div className="space-y-1">
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">Since Last week</p>
            </div>
            <div className="w-24 h-12 -mb-2">
                 <ChartContainer config={{ y: { color: chartColor } }} className="h-full w-full">
                    <LineChart accessibilityLayer data={formattedChartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <Line type="monotone" dataKey="y" stroke={chartColor} strokeWidth={2} dot={false} />
                    </LineChart>
                </ChartContainer>
            </div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <Button variant="link" className="p-0 h-auto text-xs">Details</Button>
            <div className={`flex items-center text-xs font-semibold ${changeColor}`}>
                {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {change}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
