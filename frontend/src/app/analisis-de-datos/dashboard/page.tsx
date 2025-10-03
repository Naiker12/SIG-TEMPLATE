
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { FileUp, BarChartBig, LayoutDashboard, X as XIcon, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoadingStore } from '@/hooks/use-loading-store';
import { DataTable } from '@/components/limpieza-de-datos/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useAuthStore } from '@/hooks/useAuthStore';

// --- MOCK DATA ---
const initialData = [
    { month: 'Enero', category: 'Electrónica', country: 'Colombia', sales: 4500, source: 'Web' },
    { month: 'Enero', category: 'Ropa', country: 'México', sales: 3200, source: 'Instagram' },
    { month: 'Febrero', category: 'Electrónica', country: 'Colombia', sales: 5200, source: 'Web' },
    { month: 'Febrero', category: 'Hogar', country: 'Argentina', sales: 2800, source: 'Email' },
    { month: 'Marzo', category: 'Ropa', country: 'México', sales: 4100, source: 'TikTok' },
    { month: 'Marzo', category: 'Electrónica', country: 'Chile', sales: 6200, source: 'Web' },
    { month: 'Abril', category: 'Hogar', country: 'Colombia', sales: 3100, source: 'Pinterest' },
    { month: 'Abril', category: 'Alimentos', country: 'Argentina', sales: 1500, source: 'Email' },
    { month: 'Mayo', category: 'Electrónica', country: 'México', sales: 7500, source: 'Web' },
    { month: 'Mayo', category: 'Ropa', country: 'Colombia', sales: 4800, source: 'Instagram' },
    { month: 'Junio', category: 'Electrónica', country: 'Chile', sales: 8800, source: 'Web' },
    { month: 'Junio', category: 'Hogar', country: 'México', sales: 3900, source: 'Pinterest' },
    { month: 'Julio', category: 'Juguetes', country: 'Argentina', sales: 2200, source: 'TikTok' },
    { month: 'Julio', category: 'Electrónica', country: 'Colombia', sales: 6100, source: 'Web' },
    { month: 'Agosto', category: 'Ropa', country: 'Perú', sales: 3500, source: 'Instagram' },
    { month: 'Agosto', category: 'Hogar', country: 'México', sales: 3300, source: 'Email' },
    { month: 'Septiembre', category: 'Electrónica', country: 'Colombia', sales: 9500, source: 'Web' },
    { month: 'Octubre', category: 'Ropa', country: 'Chile', sales: 5500, source: 'TikTok' },
    { month: 'Noviembre', category: 'Juguetes', country: 'México', sales: 4500, source: 'Pinterest' },
    { month: 'Diciembre', category: 'Electrónica', country: 'Colombia', sales: 12500, source: 'Web' },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const dataColumns: ColumnDef<any>[] = [
    { accessorKey: 'month', header: 'Mes' },
    { accessorKey: 'category', header: 'Categoría' },
    { accessorKey: 'country', header: 'País' },
    { accessorKey: 'source', header: 'Fuente' },
    { accessorKey: 'sales', header: 'Ventas ($)', cell: ({ row }) => `$${row.original.sales.toLocaleString()}`},
];

// --- MAIN COMPONENT ---
export default function DataAnalysisPage() {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [filters, setFilters] = useState<{ category?: string; month?: string }>({});
    const { setIsLoading } = useLoadingStore();
    const { isLoggedIn } = useAuthStore(state => ({ isLoggedIn: state.isLoggedIn }));
    const router = useRouter();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        // Zustand persistence might take a moment to hydrate.
        // This effect waits for the auth state to be confirmed.
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

    // --- DATA PROCESSING & MEMOIZATION ---
    const filteredData = useMemo(() => {
        if (!data.length) return [];
        return data.filter(item => {
            const categoryMatch = filters.category ? item.category === filters.category : true;
            const monthMatch = filters.month ? item.month === filters.month : true;
            return categoryMatch && monthMatch;
        });
    }, [data, filters]);

    const kpis = useMemo(() => {
        const totalSales = filteredData.reduce((acc, item) => acc + item.sales, 0);
        const totalOrders = filteredData.length;
        const avgTicket = totalOrders > 0 ? totalSales / totalOrders : 0;
        const newClients = new Set(filteredData.map(d => d.country)).size; // Mocking new clients as unique countries
        return {
            totalSales: totalSales.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            totalOrders,
            avgTicket: avgTicket.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            newClients,
        };
    }, [filteredData]);

    const salesByCategory = useMemo(() => {
        const categoryMap = new Map<string, number>();
        filteredData.forEach(item => {
            categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + item.sales);
        });
        return Array.from(categoryMap.entries()).map(([name, sales]) => ({ name, sales })).sort((a, b) => b.sales - a.sales);
    }, [filteredData]);

    const salesBySource = useMemo(() => {
        const sourceMap = new Map<string, number>();
        filteredData.forEach(item => {
            sourceMap.set(item.source, (sourceMap.get(item.source) || 0) + item.sales);
        });
        return Array.from(sourceMap.entries()).map(([name, sales]) => ({ name, sales })).sort((a, b) => b.sales - a.sales);
    }, [filteredData]);

    const salesOverTime = useMemo(() => {
        const monthOrder = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const monthMap = new Map<string, number>();
        filteredData.forEach(item => {
            monthMap.set(item.month, (monthMap.get(item.month) || 0) + item.sales);
        });
        return monthOrder.map(month => ({ month, sales: monthMap.get(month) || 0 }));
    }, [filteredData]);

    const incomeSourceByMonth = useMemo(() => {
        const monthOrder = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const sources = [...new Set(filteredData.map(item => item.source))];
        const dataByMonth: any = {};

        filteredData.forEach(item => {
            const shortMonth = item.month.substring(0, 3);
            if (!dataByMonth[shortMonth]) {
                dataByMonth[shortMonth] = { month: shortMonth };
                sources.forEach(source => dataByMonth[shortMonth][source] = 0);
            }
            dataByMonth[shortMonth][item.source] += item.sales;
        });

        return monthOrder.map(shortMonth => dataByMonth[shortMonth] || { month: shortMonth, ...sources.reduce((acc, s) => ({...acc, [s]: 0}), {}) });
    }, [filteredData]);


    // --- HANDLERS ---
    const handleFileProcess = () => {
        if (!file) return;
        setIsLoading(true);
        setTimeout(() => {
            setData(initialData);
            setFilters({});
            setIsLoading(false);
        }, 2000);
    }
    
    const handleFilter = (key: 'category' | 'month', value: string) => {
        setFilters(prev => ({ ...prev, [key]: prev[key] === value ? undefined : value }));
    };

    const clearFilters = () => setFilters({});
    
    // --- RENDER ---
    if (isCheckingAuth) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <DashboardSidebar />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <TopBar />
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
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
                                     <Button onClick={handleFileProcess} disabled={!file} className="w-full"><BarChartBig className="mr-2"/>Analizar Archivo</Button>
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
                                {Object.values(filters).some(Boolean) && (
                                    <Card className="bg-muted/50 border-dashed">
                                        <CardContent className="p-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-semibold">Filtros activos:</span>
                                                {filters.category && <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">{filters.category}</span>}
                                                {filters.month && <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">{filters.month}</span>}
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={clearFilters}><XIcon className="mr-2 h-4 w-4"/> Limpiar</Button>
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{kpis.totalSales}</div></CardContent></Card>
                                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Tasa de Éxito</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">36.2%</div></CardContent></Card>
                                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{kpis.newClients}</div></CardContent></Card>
                                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{kpis.avgTicket}</div></CardContent></Card>
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <Card className="lg:col-span-1">
                                        <CardHeader><CardTitle>Ventas por Categoría</CardTitle></CardHeader>
                                        <CardContent className="overflow-x-auto">
                                            <ResponsiveContainer width="100%" height={320} minWidth={250}>
                                                <PieChart>
                                                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                                                    <Pie data={salesByCategory} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                                        {salesByCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="cursor-pointer outline-none" onClick={() => handleFilter('category', entry.name)} style={{ opacity: filters.category === entry.name ? 1 : (filters.category ? 0.3 : 1) }} />)}
                                                    </Pie>
                                                    <Legend/>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                    <Card className="lg:col-span-2">
                                        <CardHeader><CardTitle>Ingresos por Mes</CardTitle></CardHeader>
                                        <CardContent className="overflow-x-auto">
                                            <ResponsiveContainer width="100%" height={320} minWidth={300}>
                                                <AreaChart data={salesOverTime}>
                                                    <defs><linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/><stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/></linearGradient></defs>
                                                    <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false}/>
                                                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`}/>
                                                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`}/>
                                                    <Area type="monotone" dataKey="sales" stroke="hsl(var(--chart-1))" fill="url(#colorSales)" strokeWidth={2} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                </div>

                                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader><CardTitle>Desglose por Fuente de Ingresos</CardTitle></CardHeader>
                                        <CardContent className="overflow-x-auto">
                                            <ResponsiveContainer width="100%" height={320} minWidth={300}>
                                                <BarChart data={salesBySource} layout="vertical">
                                                    <XAxis type="number" hide />
                                                    <YAxis type="category" dataKey="name" width={80} tickLine={false} axisLine={false}/>
                                                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                                                    <Bar dataKey="sales" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} barSize={20} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader><CardTitle>Ingresos por Fuente y Mes</CardTitle></CardHeader>
                                        <CardContent className="overflow-x-auto">
                                            <ResponsiveContainer width="100%" height={320} minWidth={300}>
                                                <BarChart data={incomeSourceByMonth}>
                                                    <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                                                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`}/>
                                                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                                                    <Legend />
                                                    <Bar dataKey="Web" stackId="a" fill="hsl(var(--chart-1))" />
                                                    <Bar dataKey="Instagram" stackId="a" fill="hsl(var(--chart-2))" />
                                                    <Bar dataKey="Email" stackId="a" fill="hsl(var(--chart-3))" />
                                                    <Bar dataKey="TikTok" stackId="a" fill="hsl(var(--chart-4))" />
                                                    <Bar dataKey="Pinterest" stackId="a" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]}/>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card>
                                    <CardHeader><CardTitle>Datos Detallados</CardTitle></CardHeader>
                                    <CardContent>
                                        <DataTable columns={dataColumns} data={filteredData} />
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
