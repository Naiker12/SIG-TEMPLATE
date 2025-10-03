import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";

type MetricCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  change: string;
}

export function MetricCard({ title, value, icon, change }: MetricCardProps) {
  const isPositive = change.startsWith('+');
  const changeColor = isPositive ? 'text-success' : 'text-destructive';

  return (
    <Card className="relative overflow-hidden">
       <div className="absolute top-0 right-0 w-24 h-24 bg-muted/20 rounded-full -translate-y-1/2 translate-x-1/4"></div>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${changeColor}`}>
          {change}
        </p>
      </CardContent>
    </Card>
  );
}
