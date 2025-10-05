
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type KpiCardProps = {
  title: string;
  value: string;
  change: string;
  icon: ReactNode;
};

export function KpiCard({ title, value, change, icon }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={cn("text-xs text-muted-foreground flex items-center")}>
          {change}
        </p>
      </CardContent>
    </Card>
  );
}
