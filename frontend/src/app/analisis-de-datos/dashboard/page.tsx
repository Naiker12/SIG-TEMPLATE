
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Loader2, FileUp, MoreHorizontal, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoadingStore } from '@/hooks/use-loading-store';
import { useAuthStore } from '@/hooks/useAuthStore';
import { KpiCard } from '@/components/analisis-de-datos/KpiCard';
import { DataFilters } from '@/components/analisis-de-datos/DataFilters';
import { mockData, mockKpis, dailyTasksData, successRateData, toolUsageData } from '@/components/analisis-de-datos/mock-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { useChartConfigStore } from '@/hooks/use-chart-config-store';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

// --- MAIN COMPONENT ---
export default function DataAnalysisPage() {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<any[]>([]);
    const { setIsLoading } = useLoadingStore();
    const { isLoggedIn } = useAuthStore(state => ({ isLoggedIn: state.isLoggedIn }));
    const router = useRouter();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const { areaChartConfig, pieChartConfig } = useChartConfigStore();

    useEffect(() => {
        if (useAuthStore.persist.hasHydrated()) {
            if (!useAuthStore.getState().isLoggedIn) {
                router.push('/');
            } else {
                setIsCheckingAuth(false);
            }
        }
        
        const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
             if (!useAuthStore.getState().isLoggedIn) {
                router.push('/');
            } else {
                setIsCheckingAuth(false);
            }
        });

        return () => unsubscribe();
    }, [isLoggedIn, router]);

    // --- HANDLERS ---
    const handleFileProcess = () => {
        if (!file) return;
        setIsLoading(true);
        setTimeout(() => {
            setData(mockData);
            setIsLoading(false);
        }, 2000);
    }

    const aggregatedPieData = useMemo(() => {
        if (!data.length) return [];
        const { labelKey, valueKey } = pieChartConfig;
        
        const aggregation = data.reduce((acc, item) => {
            const label = item[labelKey];
            const value = item[valueKey];
            if (label && typeof value === 'number') {
                if (!acc[label]) {
                    acc[label] = 0;
                }
                acc[label] += value;
            }
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(aggregation).map(([name, value]) => ({ name, value }));

    }, [data, pieChartConfig]);
    
    // --- RENDER ---
    if (isCheckingAuth) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <TopBar />
            <main className="flex-1 gap-4 p-4 sm:px-6 md:gap-8 overflow-auto pb-8">
                <div className="max-w-full mx-auto w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <header>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Dashboard de Análisis</h1>
                            <p className="text-muted-foreground mt-2 max-w-3xl">Visualiza y explora tus datos de forma interactiva.</p>
                        </header>
                         <Dialog>
                            <DialogTrigger asChild>
                                <Button size="lg"><FileUp className="mr-2"/> Cargar Datos</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Cargar Archivo de Datos</DialogTitle>
                                    <DialogDescription>Selecciona un archivo .xlsx o .csv para analizar.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <Label htmlFor="data-file">Archivo de Datos</Label>
                                    <Input id="data-file" type="file" accept=".csv, .xlsx" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
                                </div>
                                 <Button onClick={handleFileProcess} disabled={!file} className="w-full">Analizar Archivo</Button>
                            </DialogContent>
                        </Dialog>
                    </div>
                    
                    {!data.length ? (
                        <div className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed rounded-xl bg-muted/30">
                            <div className="text-center p-8">
                                <LayoutDashboard className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
                                <h2 className="text-2xl font-semibold mb-2">Bienvenido al Dashboard de Análisis</h2>
                                <p className="text-muted-foreground max-w-md mx-auto">Para empezar, carga un archivo de datos (CSV o Excel) usando el botón "Cargar Datos".</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <DataFilters />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                               {mockKpis.map((kpi, index) => <KpiCard key={index} {...kpi} />)}
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                <Card className="lg:col-span-3">
                                    <CardHeader>
                                        <CardTitle>Análisis de Métrica Principal</CardTitle>
                                        <CardDescription>Visualización del eje Y: <span className='font-semibold text-primary'>{areaChartConfig.yAxis}</span> por <span className='font-semibold text-primary'>{areaChartConfig.xAxis}</span>.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-80">
                                        <ChartContainer config={{}} className='w-full h-full'>
                                            <AreaChart data={mockData} margin={{left: -20, right: 10, top: 10, bottom: 0}}>
                                                <defs>
                                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey={areaChartConfig.xAxis} fontSize={12} tickLine={false} axisLine={false}/>
                                                <YAxis dataKey={areaChartConfig.yAxis} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`}/>
                                                <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="line" />}/>
                                                <Area type="monotone" dataKey={areaChartConfig.yAxis} stroke="hsl(var(--chart-1))" fill="url(#colorSales)" strokeWidth={2} />
                                            </AreaChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                                <Card className="lg:col-span-2">
                                    <CardHeader>
                                        <CardTitle>Distribución por Categoría</CardTitle>
                                        <CardDescription>Mostrando <span className='font-semibold text-primary'>{pieChartConfig.valueKey}</span> por <span className='font-semibold text-primary'>{pieChartConfig.labelKey}</span>.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-80">
                                         <ChartContainer config={{}} className='w-full h-full'>
                                            <PieChart>
                                                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                                                <Pie data={aggregatedPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" labelLine={false} label={({name, percent}) => `${(percent * 100).toFixed(0)}%`}>
                                                    {aggregatedPieData.map((entry, index) => (
                                                        <Cell 
                                                            key={`cell-${index}`} 
                                                            fill={COLORS[index % COLORS.length]}
                                                            stroke="hsl(var(--card))"
                                                            strokeWidth={2}
                                                        />
                                                    ))}
                                                </Pie>
                                                <ChartLegend content={<ChartLegendContent />} />
                                            </PieChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Tipos de Archivo Procesados</CardTitle>
                                        <CardDescription>Qué formatos son los más comunes.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-64">
                                        <ChartContainer config={{}} className='w-full h-full'>
                                            <BarChart data={toolUsageData} layout="vertical" margin={{ left: 10 }}>
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={80} fontSize={14} />
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                                <Bar dataKey="usage" radius={[0, 4, 4, 0]}>
                                                    {toolUsageData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle>Tareas por Día</CardTitle>
                                            <MoreHorizontal className="w-4 h-4 text-muted-foreground"/>
                                        </div>
                                        <CardDescription>Volumen de tareas en la última semana.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-48">
                                        <ChartContainer config={{}} className='w-full h-full'>
                                            <AreaChart data={dailyTasksData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="fillTasks" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="day" hide/>
                                                <YAxis hide domain={['dataMin - 10', 'dataMax + 5']}/>
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                                <Area type="monotone" dataKey="tasks" stroke="hsl(var(--chart-2))" fill="url(#fillTasks)" strokeWidth={2} />
                                            </AreaChart>
                                        </ChartContainer>
                                    </CardContent>
                                    <CardFooter className="flex justify-center text-sm text-muted-foreground">
                                        <TrendingUp className="w-4 h-4 mr-1"/>
                                        Creciendo un 5.2% esta semana
                                    </CardFooter>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle>Tasa de Éxito</CardTitle>
                                            <MoreHorizontal className="w-4 h-4 text-muted-foreground"/>
                                        </div>
                                        <CardDescription>Procesos completados vs. errores.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-48 flex items-center justify-center">
                                        <div className="relative h-40 w-40">
                                            <ChartContainer config={{}} className='w-full h-full'>
                                                <PieChart>
                                                    <Pie 
                                                        data={successRateData} 
                                                        dataKey="value"
                                                        startAngle={90} 
                                                        endAngle={-270} 
                                                        innerRadius="75%" 
                                                        outerRadius="100%"
                                                        strokeWidth={0}
                                                    >
                                                        <Cell key="success" fill="hsl(var(--chart-2))" />
                                                        <Cell key="remaining" fill="hsl(var(--muted))" />
                                                    </Pie>
                                                </PieChart>
                                            </ChartContainer>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                                <p className="text-3xl font-bold">92%</p>
                                                <p className="text-sm text-muted-foreground">Éxito</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-center gap-4 text-sm text-muted-foreground">
                                        <div className='flex items-center text-green-500'><CheckCircle className="w-4 h-4 mr-1"/> Completados: 1,226</div>
                                        <div className='flex items-center text-red-500'><AlertCircle className="w-4 h-4 mr-1"/> Errores: 28</div>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
