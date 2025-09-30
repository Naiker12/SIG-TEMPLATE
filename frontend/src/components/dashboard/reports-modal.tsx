
'use client';

import { Bar, BarChart, Line, LineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMemo } from 'react';
import type { File } from '@/services/fileService';

const chartData = [
  { month: "Enero", documents: 186, tokens: 8000 },
  { month: "Febrero", documents: 305, tokens: 12000 },
  { month: "Marzo", documents: 237, tokens: 9500 },
  { month: "Abril", documents: 273, tokens: 14000 },
  { month: "Mayo", documents: 209, tokens: 11000 },
  { month: "Junio", documents: 214, tokens: 13000 },
];

const chartConfig: ChartConfig = {
  documents: {
    label: "Documentos",
    color: "hsl(var(--chart-1))",
  },
  tokens: {
    label: "Tokens de IA",
    color: "hsl(var(--chart-2))",
  },
};


const usageChartConfig: ChartConfig = {
    count: {
        label: 'Cantidad',
        color: 'hsl(var(--chart-1))'
    }
}


type ReportsModalProps = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    files: File[];
};

export function ReportsModal({ isOpen, onOpenChange, files }: ReportsModalProps) {

    const { pieChartData, usageChartData } = useMemo(() => {
        const statusCounts = files.reduce((acc, file) => {
            acc[file.status] = (acc[file.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const pieChartData = [
            { name: 'Completo', value: statusCounts['COMPLETED'] || 0, fill: 'hsl(var(--chart-1))' },
            { name: 'Fallido', value: statusCounts['FAILED'] || 0, fill: 'hsl(var(--destructive))' },
            { name: 'En Espera', value: statusCounts['PENDING'] || 0, fill: 'hsl(var(--chart-4))' },
        ].filter(item => item.value > 0);

        const typeCounts = files.reduce((acc, file) => {
            const simpleType = file.fileType.split('/')[1] || 'desconocido';
            const capitalizedType = simpleType.charAt(0).toUpperCase() + simpleType.slice(1);
            acc[capitalizedType] = (acc[capitalizedType] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const usageChartData = Object.entries(typeCounts).map(([type, count]) => ({ type, count }));

        return { pieChartData, usageChartData };
    }, [files]);
    
    const pieChartConfig = {
        completo: { label: 'Completo' },
        fallido: { label: 'Fallido' },
        enEspera: { label: 'En Espera' },
    } satisfies ChartConfig;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl p-0 border-2 border-accent">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-2xl">Reportes de Actividad</DialogTitle>
                    <DialogDescription>
                        Visualiza las métricas clave de tu cuenta en un solo lugar.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[80vh]">
                  <div className="p-6 pt-0">
                      <Tabs defaultValue="overview">
                          <TabsList className="mb-6">
                              <TabsTrigger value="overview">Vista General</TabsTrigger>
                              <TabsTrigger value="usage">Detalle de Uso</TabsTrigger>
                              <TabsTrigger value="files">Archivos</TabsTrigger>
                          </TabsList>
                          <TabsContent value="overview">
                               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                  <Card className="lg:col-span-2">
                                      <CardHeader>
                                          <CardTitle>Uso Mensual (Simulado)</CardTitle>
                                          <CardDescription>Documentos procesados y tokens de IA utilizados en los últimos 6 meses.</CardDescription>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="overflow-x-auto">
                                          <ChartContainer config={chartConfig} className="h-80 w-full min-w-[300px]">
                                              <LineChart accessibilityLayer data={chartData} margin={{ top: 20, left: 12, right: 12 }} >
                                                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                                                  <YAxis yAxisId="left" tickLine={false} axisLine={false} tickMargin={8} />
                                                  <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tickMargin={8} />
                                                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                                  <ChartLegend content={<ChartLegendContent />} />
                                                  <Line yAxisId="left" dataKey="documents" type="natural" stroke="var(--color-documents)" strokeWidth={2} dot={true} />
                                                  <Line yAxisId="right" dataKey="tokens" type="natural" stroke="var(--color-tokens)" strokeWidth={2} dot={true} />
                                              </LineChart>
                                          </ChartContainer>
                                          </div>
                                      </CardContent>
                                  </Card>
                                  <Card>
                                      <CardHeader>
                                          <CardTitle>Estado de los Archivos</CardTitle>
                                          <CardDescription>Distribución de todos los archivos procesados.</CardDescription>
                                      </CardHeader>
                                      <CardContent className="flex justify-center overflow-x-auto">
                                          <ChartContainer config={pieChartConfig} className="h-80 w-full min-w-[300px]">
                                              <RechartsPieChart>
                                                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                                                  <Pie data={pieChartData} dataKey="value" nameKey="name" labelLine={false} label={({payload, ...props}) => `${props.percent.toFixed(0)}%`} strokeWidth={2}/>
                                                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                                              </RechartsPieChart>
                                          </ChartContainer>
                                      </CardContent>
                                  </Card>
                              </div>
                          </TabsContent>
                          <TabsContent value="usage">
                            <div className="overflow-x-auto">
                              <Card>
                                  <CardHeader>
                                      <CardTitle>Uso por Tipo de Documento</CardTitle>
                                      <CardDescription>Cantidad de análisis realizados para cada tipo de fuente de datos.</CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                      <ChartContainer config={usageChartConfig} className="h-96 w-full min-w-[300px]">
                                          <BarChart data={usageChartData} layout="vertical" margin={{ left: 20 }}>
                                              <YAxis dataKey="type" type="category" tickLine={false} axisLine={false} tickMargin={10} />
                                              <XAxis type="number" dataKey="count" hide />
                                              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                              <Bar dataKey="count" layout="vertical" fill="var(--color-count)" radius={5} />
                                          </BarChart>
                                      </ChartContainer>
                                  </CardContent>
                              </Card>
                              </div>
                          </TabsContent>
                           <TabsContent value="files">
                             <div className="overflow-x-auto">
                              <div className="text-center p-12 text-muted-foreground border-2 border-dashed rounded-lg min-w-[300px]">
                                  <p className="font-medium">Próximamente: reportes detallados sobre archivos.</p>
                                  <p className="text-sm">Aquí podrás ver análisis por tamaño, tipo y fecha de subida.</p>
                              </div>
                              </div>
                          </TabsContent>
                      </Tabs>
                  </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
