
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, BarChart as BarChartIcon, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

const usageData = [
  { day: 'Hace 6d', calls: 310 },
  { day: 'Hace 5d', calls: 280 },
  { day: 'Hace 4d', calls: 350 },
  { day: 'Hace 3d', calls: 390 },
  { day: 'Hace 2d', calls: 410 },
  { day: 'Ayer', calls: 320 },
  { day: 'Hoy', calls: 45 },
];

const chartConfig = {
  calls: {
    label: 'Llamadas',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;


export function ApiAnalytics({ api }: { api: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChartIcon /> Resumen de Métricas</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2"><TrendingUp className="w-4 h-4"/>Llamadas Hoy</p>
            <p className="text-2xl font-bold">{api.callsToday}<span className="text-base font-normal text-muted-foreground">/1000</span></p>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2"><AlertCircle className="w-4 h-4"/>Uso Límite Diario</p>
            <p className="text-2xl font-bold">{api.usage}%</p>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Llamadas (7 días)</p>
            <p className="text-2xl font-bold">1,240</p>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2"><Clock className="w-4 h-4"/>T. Respuesta Prom.</p>
            <p className="text-2xl font-bold">120ms</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Uso (últimos 7 días)</CardTitle>
          <CardDescription>Visualiza las llamadas a la API realizadas cada día durante la última semana.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart accessibilityLayer data={usageData}>
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="calls" fill="var(--color-calls)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-500"><AlertTriangle /> Alertas Activas</CardTitle>
          <CardDescription>Eventos y umbrales importantes detectados recientemente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
           <div className="p-3 bg-destructive/10 text-destructive-foreground rounded-lg border border-destructive/20 flex items-center gap-3">
               <AlertTriangle className="h-5 w-5"/>
               <p><span className="font-semibold">Límite de uso cercano:</span> Has alcanzado el {api.usage}% de tu cuota diaria de llamadas.</p>
           </div>
            <div className="p-3 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-lg border border-yellow-500/20 flex items-center gap-3">
               <TrendingUp className="h-5 w-5"/>
               <p><span className="font-semibold">Pico de uso detectado:</span> Se registraron 25 llamadas a las 14:30.</p>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
