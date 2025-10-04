
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type KpiCardProps = {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: ReactNode;
};

export function KpiCard({ title, value, change, isPositive, icon }: KpiCardProps) {
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
  const ChangeIcon = isPositive ? ArrowUp : ArrowDown;

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={cn("text-xs text-muted-foreground flex items-center", changeColor)}>
          <ChangeIcon className="h-4 w-4 mr-1" />
          {change} vs. el mes pasado
        </p>
      </CardContent>
    </Card>
  );
}
