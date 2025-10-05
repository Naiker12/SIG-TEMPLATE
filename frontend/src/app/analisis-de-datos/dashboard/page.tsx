
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Loader2, FileUp, FolderOpen, Save, FileSpreadsheet, LineChart, BarChart3, PieChartIcon, AreaChart, GitCompareArrows } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoadingStore } from '@/hooks/use-loading-store';
import { useAuthStore } from '@/hooks/useAuthStore';
import { KpiCard } from '@/components/analisis-de-datos/KpiCard';
import { DataFilters } from '@/components/analisis-de-datos/DataFilters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Area, Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Cell, Line, ComposedChart } from "recharts";
import { useChartConfigStore } from '@/hooks/use-chart-config-store';
import { useToast } from '@/hooks/use-toast';
import { getProjects, createProject, uploadFileForAnalysis, getFileAnalysis } from '@/services/analysisService';
import type { Project, AnalysisResult } from '@/services/types';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--muted))'];
const MAX_CATEGORIES = 7; // Mostrar 7 categorías + "Otros"

const aggregateData = (data: any[], categoryKey: string, valueKey: string) => {
    if (!data || !categoryKey || !valueKey) return [];

    const grouped = data.reduce((acc, row) => {
        const label = row[categoryKey];
        const value = parseFloat(row[valueKey]);
        if (label !== null && label !== undefined && !isNaN(value)) {
            acc[label] = (acc[label] || 0) + value;
        }
        return acc;
    }, {} as Record<string, number>);

    const sorted = Object.entries(grouped).sort(([, a], [, b]) => b - a);

    if (sorted.length > MAX_CATEGORIES + 1) {
        const top = sorted.slice(0, MAX_CATEGORIES);
        const otherSum = sorted.slice(MAX_CATEGORIES).reduce((sum, [, value]) => sum + value, 0);
        return [...top.map(([name, value]) => ({ name, value })), { name: 'Otros', value: otherSum }];
    }

    return sorted.map(([name, value]) => ({ name, value }));
};


// --- MAIN COMPONENT ---
export default function DataAnalysisPage() {
    const [file, setFile] = useState<File | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    
    const { setIsLoading } = useLoadingStore();
    const { toast } = useToast();
    const { isLoggedIn } = useAuthStore();
    const router = useRouter();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const { 
        areaChartConfig, 
        pieChartConfig, 
        setAvailableColumns,
        selectedCategories, 
    } = useChartConfigStore();

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
    
    // --- DATA PROCESSING ---
    const filteredData = useMemo(() => {
        if (!analysisResult?.sample_data || !pieChartConfig.labelKey) return [];
        if (selectedCategories.length === 0) return analysisResult.sample_data;
        return analysisResult.sample_data.filter(row => selectedCategories.includes(row[pieChartConfig.labelKey]));
    }, [analysisResult, pieChartConfig.labelKey, selectedCategories]);
    
    const aggregatedPieData = useMemo(() => {
        return aggregateData(filteredData, pieChartConfig.labelKey, pieChartConfig.valueKey);
    }, [filteredData, pieChartConfig]);

    const allCategories = useMemo(() => {
        if (!analysisResult?.sample_data || !pieChartConfig.labelKey) return [];
        return [...new Set(analysisResult.sample_data.map(row => row[pieChartConfig.labelKey]).filter(Boolean))];
    }, [analysisResult, pieChartConfig.labelKey]);

    useEffect(() => {
        useChartConfigStore.getState().setAllCategories(allCategories as string[]);
    }, [allCategories]);


    // --- API CALLS & HANDLERS ---
    const fetchProjects = async () => {
        if (!isLoggedIn) return;
        try {
            const userProjects = await getProjects();
            setProjects(userProjects);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error al cargar proyectos',
                description: 'No se pudieron obtener tus proyectos guardados.'
            });
        }
    };

    const handleOpenProjectsModal = () => {
        fetchProjects();
        setIsProjectsModalOpen(true);
    }
    
    const handleFileProcess = async () => {
        if (!file) return;
        setIsUploadModalOpen(false);
        setIsLoading(true);
        try {
            const { file_metadata } = await uploadFileForAnalysis(file);
            toast({ title: "Archivo Subido", description: `"${file_metadata.filename}" procesado. Obteniendo análisis...` });
            
            const analysisData = await getFileAnalysis(file_metadata.id);
            setAnalysisResult(analysisData);

            // Update chart config store with available columns
            setAvailableColumns(analysisData.numerical_columns, analysisData.categorical_columns);

        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error en el Análisis',
                description: error instanceof Error ? error.message : "No se pudo analizar el archivo."
            });
        } finally {
            setIsLoading(false);
        }
    }
    
    const handleLoadProject = async (projectId: string) => {
        // This is a dummy implementation
        setIsProjectsModalOpen(false);
        setIsLoading(true);
        try {
             const dummyAnalysis: AnalysisResult = {
                columns: ['mes', 'categoria', 'ingresos', 'costos', 'beneficio'],
                numerical_columns: ['ingresos', 'costos', 'beneficio'],
                categorical_columns: ['mes', 'categoria'],
                total_rows: 120,
                basic_stats: {
                    ingresos: { mean: 5000, std: 1000, count: 120 },
                    costos: { mean: 3000, std: 500, count: 120 },
                    beneficio: { mean: 2000, std: 600, count: 120 },
                },
                sample_data: Array.from({length: 12}, (_, i) => ({
                    mes: new Date(2023, i).toLocaleString('es-ES', { month: 'short' }),
                    categoria: ['Electrónica', 'Ropa', 'Hogar', 'Juguetes'][i % 4],
                    ingresos: 4000 + Math.random() * 2000,
                    costos: 2500 + Math.random() * 1000,
                    beneficio: 1500 + Math.random() * 1000,
                }))
            };
            setAnalysisResult(dummyAnalysis);
            setAvailableColumns(dummyAnalysis.numerical_columns, dummyAnalysis.categorical_columns);
            toast({ title: 'Proyecto Cargado (Simulación)', description: 'Datos de ejemplo cargados.' });
        } catch (error) {
             toast({ variant: 'destructive', title: 'Error', description: "No se pudo cargar el proyecto simulado." });
        } finally {
            setIsLoading(false);
        }
    }

    const handleSaveProject = async () => {
        if (!analysisResult) return;
        try {
            await createProject({
                name: `Mi Proyecto ${new Date().toLocaleTimeString()}`,
                description: 'Un análisis guardado desde el dashboard',
                fileId: 'dummy-file-id',
                config: { areaChartConfig, pieChartConfig }
            });
            toast({ title: 'Proyecto Guardado (Simulación)' });
        } catch (error) {
             toast({ variant: 'destructive', title: 'Error', description: "No se pudo guardar el proyecto." });
        }
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
                         <div className="flex items-center gap-2">
                             <Button variant="outline" size="lg" onClick={handleOpenProjectsModal}>
                                 <FolderOpen className="mr-2 h-4 w-4"/> Ver Proyectos
                             </Button>
                             {analysisResult && (
                                <Button variant="outline" size="lg" onClick={handleSaveProject}>
                                    <Save className="mr-2 h-4 w-4"/> Guardar
                                </Button>
                             )}
                             <Button size="lg" onClick={() => setIsUploadModalOpen(true)}>
                                <FileUp className="mr-2 h-4 w-4"/> Cargar Datos
                             </Button>
                         </div>
                    </div>
                    
                    {!analysisResult ? (
                        <div className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed rounded-xl bg-card">
                            <div className="text-center p-8">
                                <LayoutDashboard className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
                                <h2 className="text-2xl font-semibold mb-2">Bienvenido al Dashboard de Análisis</h2>
                                <p className="text-muted-foreground max-w-md mx-auto">Para empezar, carga un archivo de datos (CSV o Excel) o abre un proyecto guardado.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <DataFilters />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                               {Object.entries(analysisResult.basic_stats).slice(0,3).map(([key, stats]) => (
                                <KpiCard 
                                    key={key} 
                                    title={`Media de ${key}`}
                                    value={stats.mean?.toFixed(2) ?? 'N/A'}
                                    change={`Total: ${stats.count?.toLocaleString() ?? 'N/A'}`}
                                    icon={<BarChart3 className="h-4 w-4" />}
                                />
                               ))}
                                <KpiCard 
                                    title="Filas Totales"
                                    value={analysisResult.total_rows.toLocaleString()}
                                    change={`${analysisResult.columns.length} columnas`}
                                    icon={<FileSpreadsheet className="h-4 w-4" />}
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                <Card className="lg:col-span-3">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><BarChart3/> Métrica Principal por Categoría</CardTitle>
                                        <CardDescription>Visualización del eje Y: <span className='font-semibold text-primary'>{areaChartConfig.yAxis}</span> por <span className='font-semibold text-primary'>{areaChartConfig.xAxis}</span>.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-80">
                                         <ChartContainer config={{}} className="w-full h-full">
                                            <BarChart data={filteredData} margin={{ top: 20, right: 20, bottom: 5, left: 20 }}>
                                                <CartesianGrid vertical={false} />
                                                <XAxis dataKey={areaChartConfig.xAxis} tickLine={false} axisLine={false} tickMargin={8} angle={-45} textAnchor="end" height={60} interval={0} />
                                                <YAxis dataKey={areaChartConfig.yAxis} tickLine={false} axisLine={false} tickMargin={8} />
                                                <ChartTooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                                                <Bar dataKey={areaChartConfig.yAxis} fill="hsl(var(--chart-1))" radius={4} />
                                            </BarChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                                <Card className="lg:col-span-2">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><PieChartIcon/> Distribución por Categoría</CardTitle>
                                        <CardDescription>Mostrando <span className='font-semibold text-primary'>{pieChartConfig.valueKey}</span> por <span className='font-semibold text-primary'>{pieChartConfig.labelKey}</span>.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-80">
                                         <ChartContainer config={{}} className='w-full h-full'>
                                            <PieChart>
                                                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                                                <Pie data={aggregatedPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" labelLine={false} label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                                    {aggregatedPieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="hsl(var(--card))" strokeWidth={2} />
                                                    ))}
                                                </Pie>
                                                <ChartLegend content={<ChartLegendContent nameKey="name"/>} />
                                            </PieChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><LineChart/> Evolución Temporal</CardTitle>
                                        <CardDescription>Tendencia de <span className='font-semibold text-primary'>{areaChartConfig.yAxis}</span> a lo largo del tiempo.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-72">
                                        <ChartContainer config={{}} className="w-full h-full">
                                            <ComposedChart data={filteredData}>
                                                 <CartesianGrid vertical={false} />
                                                 <XAxis dataKey={areaChartConfig.xAxis} tickLine={false} axisLine={false} tickMargin={8} />
                                                 <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                                 <ChartTooltip content={<ChartTooltipContent />} />
                                                 <ChartLegend />
                                                 <Area type="monotone" dataKey={areaChartConfig.yAxis} fill="hsl(var(--chart-2))" stroke="hsl(var(--chart-2))" fillOpacity={0.3} />
                                                 <Line type="monotone" dataKey={areaChartConfig.yAxis} stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                                            </ComposedChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                                 <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><GitCompareArrows/> Comparativa de Métricas</CardTitle>
                                        <CardDescription>Relación entre <span className='font-semibold text-primary'>{pieChartConfig.valueKey}</span> y <span className='font-semibold text-primary'>{areaChartConfig.yAxis}</span>.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-72">
                                         <ChartContainer config={{}} className="w-full h-full">
                                            <BarChart data={filteredData} layout="vertical">
                                                <CartesianGrid horizontal={false} />
                                                <XAxis type="number" />
                                                <YAxis dataKey={areaChartConfig.xAxis} type="category" tickLine={false} axisLine={false} tickMargin={8} width={80} />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                                <ChartLegend />
                                                <Bar dataKey={pieChartConfig.valueKey} stackId="a" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                                                <Bar dataKey={areaChartConfig.yAxis} stackId="a" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                                            </BarChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Modals */}
            <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Cargar Archivo de Datos</DialogTitle>
                        <DialogDescription>Selecciona un archivo .xlsx o .csv para analizar.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Label htmlFor="data-file">Archivo de Datos</Label>
                        <Input id="data-file" type="file" accept=".csv, .xlsx, .xls" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
                    </div>
                    <Button onClick={handleFileProcess} disabled={!file} className="w-full">Analizar Archivo</Button>
                </DialogContent>
            </Dialog>
            
            <Dialog open={isProjectsModalOpen} onOpenChange={setIsProjectsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Mis Proyectos de Análisis</DialogTitle>
                        <DialogDescription>Selecciona un proyecto guardado para cargarlo.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        {projects.length > 0 ? (
                            projects.map(proj => (
                                <Card key={proj.id} className="hover:border-primary transition-colors cursor-pointer" onClick={() => handleLoadProject(proj.id)}>
                                    <CardHeader>
                                        <CardTitle className="text-base">{proj.name}</CardTitle>
                                        <CardDescription>Última modificación: {new Date(proj.updatedAt).toLocaleDateString()}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                                <FolderOpen className="h-12 w-12 mx-auto mb-4" />
                                <p>No tienes proyectos guardados.</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
