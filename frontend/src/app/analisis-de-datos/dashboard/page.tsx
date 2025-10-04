
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Loader2, FileUp, Settings2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoadingStore } from '@/hooks/use-loading-store';
import { useAuthStore } from '@/hooks/useAuthStore';
import { KpiCard } from '@/components/analisis-de-datos/KpiCard';
import { ChartConfigSheet } from '@/components/analisis-de-datos/ChartConfigSheet';
import { DataFilters } from '@/components/analisis-de-datos/DataFilters';
import { mockData, mockKpis, mockSalesOverTime, mockSalesByCategory } from '@/components/analisis-de-datos/mock-data.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend, PieChart, Pie, Cell } from "recharts";

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

// --- MAIN COMPONENT ---
export default function DataAnalysisPage() {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<any[]>([]);
    const { setIsLoading } = useLoadingStore();
    const { isLoggedIn } = useAuthStore(state => ({ isLoggedIn: state.isLoggedIn }));
    const router = useRouter();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

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
                                        <CardTitle>Ingresos por Mes</CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-80">
                                        <ChartContainer config={{}} className='w-full h-full'>
                                            <AreaChart data={mockSalesOverTime} margin={{left: -20, right: 10, top: 10, bottom: 0}}>
                                                <defs>
                                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false}/>
                                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`}/>
                                                <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="line" />}/>
                                                <Area type="monotone" dataKey="sales" stroke="hsl(var(--chart-1))" fill="url(#colorSales)" strokeWidth={2} />
                                            </AreaChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                                <Card className="lg:col-span-2">
                                    <CardHeader>
                                        <CardTitle>Ventas por Categoría</CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-80">
                                         <ChartContainer config={{}} className='w-full h-full'>
                                            <PieChart>
                                                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                                                <Pie data={mockSalesByCategory} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius="80%" labelLine={false} label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                                    {mockSalesByCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                                </Pie>
                                                <ChartLegend content={<ChartLegendContent />} />
                                            </PieChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
