
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Loader2, FileUp, MoreHorizontal, TrendingUp, CheckCircle, AlertCircle, FolderOpen, UploadCloud, Save, FileSpreadsheet } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoadingStore } from '@/hooks/use-loading-store';
import { useAuthStore } from '@/hooks/useAuthStore';
import { KpiCard } from '@/components/analisis-de-datos/KpiCard';
import { DataFilters } from '@/components/analisis-de-datos/DataFilters';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import { useChartConfigStore } from '@/hooks/use-chart-config-store';
import { useToast } from '@/hooks/use-toast';
import { getProjects, createProject, uploadFileForAnalysis, getFileAnalysis } from '@/services/analysisService';
import type { Project, AnalysisResult } from '@/services/types';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

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

    const { areaChartConfig, pieChartConfig, setAvailableColumns } = useChartConfigStore();

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
        setIsProjectsModalOpen(false);
        setIsLoading(true);
        try {
            // In a real scenario, you'd fetch the project, its fileId, and then the analysis for that file.
            // For now, we simulate this by just loading some data.
            // const project = await getProjectById(projectId);
            // const analysisData = await getFileAnalysis(project.fileId);
            // setAnalysisResult(analysisData);
            // setAvailableColumns(analysisData.numerical_columns, analysisData.categorical_columns);
             toast({
                title: 'Proyecto Cargado (Simulación)',
                description: 'La carga de datos y configuración del proyecto se implementaría aquí.',
            });
             // Simulate loading some analysis
             const dummyAnalysis: AnalysisResult = {
                columns: ['mes', 'categoria', 'ingresos', 'costos'],
                numerical_columns: ['ingresos', 'costos'],
                categorical_columns: ['mes', 'categoria'],
                total_rows: 100,
                basic_stats: {
                    ingresos: { mean: 5000, std: 1000, count: 100, min: 1000, '25%': 4000, '50%': 5000, '75%': 6000, max: 9000 },
                    costos: { mean: 3000, std: 500, count: 100, min: 1000, '25%': 2500, '50%': 3000, '75%': 3500, max: 4500 },
                },
                sample_data: [
                    { mes: 'Ene', categoria: 'A', ingresos: 4500, costos: 2800 },
                    { mes: 'Feb', categoria: 'B', ingresos: 5200, costos: 3100 },
                    { mes: 'Mar', categoria: 'A', ingresos: 4100, costos: 2000 },
                ]
            };
            setAnalysisResult(dummyAnalysis);
            setAvailableColumns(dummyAnalysis.numerical_columns, dummyAnalysis.categorical_columns);

        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Error al Cargar Proyecto',
                description: error instanceof Error ? error.message : "No se pudo cargar el proyecto.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleSaveProject = async () => {
        if (!analysisResult) {
             toast({
                variant: 'destructive',
                title: 'No hay datos para guardar',
                description: 'Carga y analiza un archivo antes de guardar un proyecto.',
            });
            return;
        }

        // Dummy implementation for saving project
        try {
            await createProject({
                name: `Mi Proyecto ${new Date().toLocaleTimeString()}`,
                description: 'Un análisis guardado desde el dashboard',
                fileId: 'dummy-file-id', // This should come from the uploaded file metadata
                config: { areaChartConfig, pieChartConfig }
            });
            toast({
                title: 'Proyecto Guardado (Simulación)',
                description: 'Tu configuración de análisis actual ha sido guardada.',
            });
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Error al Guardar',
                description: error instanceof Error ? error.message : "No se pudo guardar el proyecto.",
            });
        }
    }
    
    // Aggregated data for the pie chart
    const aggregatedPieData = useMemo(() => {
        if (!analysisResult?.sample_data || !pieChartConfig.labelKey || !pieChartConfig.valueKey) return [];

        const grouped = analysisResult.sample_data.reduce((acc, row) => {
            const label = row[pieChartConfig.labelKey];
            const value = parseFloat(row[pieChartConfig.valueKey]);
            if (label && !isNaN(value)) {
                acc[label] = (acc[label] || 0) + value;
            }
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(grouped).map(([name, value]) => ({ name, value }));

    }, [analysisResult, pieChartConfig]);


    const fileTypeUsage = useMemo(() => {
        if (!analysisResult || !file) return [{ name: 'N/A', usage: 0 }];
        const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
        const isCsv = file.name.endsWith('.csv');
        
        let fileTypes = [];
        if (isExcel) fileTypes.push({ name: 'Excel', usage: 100 });
        if (isCsv) fileTypes.push({ name: 'CSV', usage: 100 });
        
        return fileTypes.length > 0 ? fileTypes : [{ name: 'Otro', usage: 100 }];
    }, [analysisResult, file]);
    
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
                               {Object.entries(analysisResult.basic_stats).map(([key, stats]) => (
                                <KpiCard 
                                    key={key} 
                                    title={`Media de ${key}`}
                                    value={stats.mean?.toFixed(2) ?? 'N/A'}
                                    change={`Std: ${stats.std?.toFixed(2) ?? 'N/A'}`}
                                    icon={<TrendingUp className="h-4 w-4" />}
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
                                        <CardTitle>Análisis de Métrica Principal</CardTitle>
                                        <CardDescription>Visualización del eje Y: <span className='font-semibold text-primary'>{areaChartConfig.yAxis}</span> por <span className='font-semibold text-primary'>{areaChartConfig.xAxis}</span>.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-80">
                                         <ChartContainer config={{}} className="w-full h-full">
                                            <BarChart data={analysisResult.sample_data} margin={{ top: 20, right: 20, bottom: 5, left: 20 }}>
                                                <CartesianGrid vertical={false} />
                                                <XAxis dataKey={areaChartConfig.xAxis} tickLine={false} axisLine={false} tickMargin={8} />
                                                <YAxis dataKey={areaChartConfig.yAxis} tickLine={false} axisLine={false} tickMargin={8} />
                                                <ChartTooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                                                <Bar dataKey={areaChartConfig.yAxis} fill="hsl(var(--chart-1))" radius={4} />
                                            </BarChart>
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
                                    </CardHeader>
                                    <CardContent className="h-64">
                                        <ChartContainer config={{}} className='w-full h-full'>
                                            <BarChart data={fileTypeUsage} layout="vertical" margin={{ left: 10 }}>
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={80} fontSize={14} />
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                                <Bar dataKey="usage" radius={[0, 4, 4, 0]}>
                                                    {fileTypeUsage.map((entry, index) => (
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
                                        <CardDescription>Esta es una simulación de datos.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-48">
                                         <ChartContainer config={{}} className="w-full h-full">
                                            <AreaChart data={[
                                                { day: 'Lun', tasks: 40 }, { day: 'Mar', tasks: 30 }, { day: 'Mié', tasks: 20 },
                                                { day: 'Jue', tasks: 27 }, { day: 'Vie', tasks: 18 }, { day: 'Sáb', tasks: 23 },
                                                { day: 'Dom', tasks: 34 }
                                            ]} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="fillTasks" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="day" hide/>
                                                <YAxis hide domain={['dataMin - 10', 'dataMax + 5']}/>
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                                <AreaChart dataKey="tasks" type="monotone" stroke="hsl(var(--chart-2))" fill="url(#fillTasks)" strokeWidth={2} />
                                            </AreaChart>
                                        </ChartContainer>
                                    </CardContent>
                                    <CardFooter className="flex justify-center text-sm text-muted-foreground">
                                        <TrendingUp className="w-4 h-4 mr-1"/>
                                        Simulación
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
                                                        data={[{name: 'success', value: 100}]} 
                                                        dataKey="value"
                                                        startAngle={90} 
                                                        endAngle={-270} 
                                                        innerRadius="75%" 
                                                        outerRadius="100%"
                                                        strokeWidth={0}
                                                    >
                                                        <Cell key="success" fill="hsl(var(--chart-1))" />
                                                    </Pie>
                                                </PieChart>
                                            </ChartContainer>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                                <p className="text-3xl font-bold">100%</p>
                                                <p className="text-sm text-muted-foreground">Éxito</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-center gap-4 text-sm text-muted-foreground">
                                        <div className='flex items-center text-green-500'><CheckCircle className="w-4 h-4 mr-1"/> Filas: {analysisResult.total_rows}</div>
                                        <div className='flex items-center text-red-500'><AlertCircle className="w-4 h-4 mr-1"/> Errores: 0</div>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Upload Modal */}
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
            
            {/* Projects Modal */}
            <Dialog open={isProjectsModalOpen} onOpenChange={setIsProjectsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Mis Proyectos de Análisis</DialogTitle>
                        <DialogDescription>Selecciona un proyecto guardado para cargarlo o crea uno nuevo.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        {projects.length > 0 ? (
                            projects.map(proj => (
                                <Card 
                                    key={proj.id} 
                                    className="hover:border-primary transition-colors cursor-pointer"
                                    onClick={() => handleLoadProject(proj.id)}
                                >
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
                     <div className='flex flex-col sm:flex-row gap-2 border-t pt-4'>
                        <Button 
                            variant="secondary" 
                            className="w-full"
                            onClick={() => {
                                setIsProjectsModalOpen(false);
                                setIsUploadModalOpen(true);
                            }}
                        >
                            <UploadCloud className="mr-2 h-4 w-4"/> Cargar Nuevo Archivo
                        </Button>
                     </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
