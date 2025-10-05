
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Loader2, FileUp, TrendingUp, CheckCircle, AlertCircle, FolderOpen, UploadCloud, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoadingStore } from '@/hooks/use-loading-store';
import { useAuthStore } from '@/hooks/useAuthStore';
import { KpiCard } from '@/components/analisis-de-datos/KpiCard';
import { DataFilters } from '@/components/analisis-de-datos/DataFilters';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import { useChartConfigStore } from '@/hooks/use-chart-config-store';
import { useToast } from '@/hooks/use-toast';
import { getProjects, createProject, uploadFileForAnalysis, getFileAnalysis, getProjectById } from '@/services/analysisService';
import type { Project, AnalysisResult, FileMetadata } from '@/services/types';
import { Textarea } from '@/components/ui/textarea';
import { exportToPng, exportToCsv, exportToXlsx } from '@/lib/exportUtils';


const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const ChartPlaceholder = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center h-full text-muted-foreground text-center p-4">
        {message}
    </div>
);

// --- MAIN COMPONENT ---
export default function DataAnalysisPage() {
    const dashboardRef = useRef<HTMLDivElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    
    const { setIsLoading } = useLoadingStore();
    const { toast } = useToast();
    const { isLoggedIn } = useAuthStore();
    const router = useRouter();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { areaChartConfig, pieChartConfig, setAvailableColumns, setAreaChartConfig, setPieChartConfig } = useChartConfigStore();

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
            const uploadResponse = await uploadFileForAnalysis(file);
            setFileMetadata(uploadResponse.file_metadata);
            toast({ title: "Archivo Subido", description: `"${uploadResponse.file_metadata.filename}" procesado. Obteniendo análisis...` });
            
            const analysisData = await getFileAnalysis(uploadResponse.file_metadata.id);
            setAnalysisResult(analysisData);
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
            const project = await getProjectById(projectId);
            const analysisData = await getFileAnalysis(project.fileId);
            setAnalysisResult(analysisData);
            setAvailableColumns(analysisData.numerical_columns, analysisData.categorical_columns);

            // Restore chart configs from project
            if (project.config.areaChartConfig) {
              setAreaChartConfig(project.config.areaChartConfig);
            }
            if (project.config.pieChartConfig) {
              setPieChartConfig(project.config.pieChartConfig);
            }

            // Restore file metadata for context
            const dummyFile: FileMetadata = {
                id: project.fileId,
                filename: 'Archivo de Proyecto', // Filename is not stored in project, so we use a placeholder
                filetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Placeholder
                size: 0,
                columns: analysisData.columns,
                rows_count: analysisData.total_rows,
                uploadedAt: project.createdAt,
                userId: project.userId
            };
            setFileMetadata(dummyFile);


            toast({
                title: `Proyecto "${project.name}" Cargado`,
                description: 'Se han restaurado los datos y la configuración del dashboard.',
            });

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

    const handleSaveProject = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!analysisResult || !fileMetadata) return;

        const formData = new FormData(event.currentTarget);
        const name = formData.get('projectName') as string;
        const description = formData.get('projectDescription') as string;

        setIsSaving(true);
        try {
            await createProject({
                name,
                description,
                fileId: fileMetadata.id,
                config: { areaChartConfig, pieChartConfig }
            });
            setIsSaveModalOpen(false);
            toast({
                title: 'Proyecto Guardado',
                description: `Tu análisis "${name}" ha sido guardado con éxito.`,
            });
            fetchProjects(); // Refresh project list in the background
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Error al Guardar',
                description: error instanceof Error ? error.message : "No se pudo guardar el proyecto.",
            });
        } finally {
            setIsSaving(false);
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
        if (!analysisResult || !fileMetadata) return [];
        const fileType = fileMetadata.filetype.toLowerCase();
        const isExcel = fileType.includes('excel') || fileType.includes('spreadsheetml');
        const isCsv = fileType.includes('csv');

        return [
            { name: 'Excel', usage: isExcel ? 1 : 0 },
            { name: 'CSV', usage: isCsv ? 1 : 0 },
        ].filter(item => item.usage > 0);
    }, [analysisResult, fileMetadata]);
    
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
            <main ref={dashboardRef} className="flex-1 gap-4 p-4 sm:px-6 md:gap-8 overflow-auto pb-8">
                <div className="max-w-full mx-auto w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <header>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Dashboard de Análisis</h1>
                            <p className="text-muted-foreground mt-2 max-w-3xl">Visualiza y explora tus datos de forma interactiva.</p>
                        </header>
                         <div className="flex items-center gap-2">
                             <Button variant="outline" size="lg" onClick={handleOpenProjectsModal}>
                                 <FolderOpen className="mr-2"/> Ver Proyectos
                             </Button>
                             {analysisResult && (
                                <Button variant="outline" size="lg" onClick={() => setIsSaveModalOpen(true)}>
                                    <Save className="mr-2 h-5 w-5"/> Guardar
                                </Button>
                             )}
                             <Button size="lg" onClick={() => setIsUploadModalOpen(true)}>
                                <FileUp className="mr-2"/> Cargar Datos
                             </Button>
                         </div>
                    </div>
                    
                    {!analysisResult ? (
                        <div className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed rounded-xl bg-muted/30">
                            <div className="text-center p-8">
                                <LayoutDashboard className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
                                <h2 className="text-2xl font-semibold mb-2">Bienvenido al Dashboard de Análisis</h2>
                                <p className="text-muted-foreground max-w-md mx-auto">Para empezar, carga un archivo de datos (CSV o Excel) o abre un proyecto guardado.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <DataFilters 
                                onExport={(format) => {
                                    if (!analysisResult) return;
                                    if (format === 'png') exportToPng(dashboardRef.current, 'dashboard.png');
                                    if (format === 'csv') exportToCsv(analysisResult.sample_data, 'sample_data.csv');
                                    if (format === 'xlsx') exportToXlsx(analysisResult.sample_data, 'sample_data.xlsx');
                                }}
                            />
                            
                            {Object.keys(analysisResult.basic_stats).length > 0 && (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {Object.entries(analysisResult.basic_stats).map(([key, stats]) => (
                                    <KpiCard 
                                        key={key} 
                                        title={`Media de ${key}`}
                                        value={stats.mean?.toFixed(2) ?? 'N/A'}
                                        change={`Std: ${stats.std?.toFixed(2) ?? 'N/A'}`}
                                        isPositive={true}
                                        icon={<TrendingUp className="h-4 w-4" />}
                                    />
                                ))}
                              </div>
                            )}
                            
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                <Card className="lg:col-span-3">
                                    <CardHeader>
                                        <CardTitle>Análisis de Métrica Principal</CardTitle>
                                        <CardDescription>
                                            {areaChartConfig.yAxis && areaChartConfig.xAxis ? (
                                                <>Visualización del eje Y: <span className='font-semibold text-primary'>{areaChartConfig.yAxis}</span> por <span className='font-semibold text-primary'>{areaChartConfig.xAxis}</span>.</>
                                            ) : (
                                                <>Configura los ejes para ver el gráfico.</>
                                            )}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-80">
                                        {(areaChartConfig.yAxis && areaChartConfig.xAxis) ? (
                                            <ChartContainer config={{}} className="w-full h-full">
                                                <AreaChart data={analysisResult.sample_data}>
                                                    <defs>
                                                        <linearGradient id="fillArea" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid vertical={false} />
                                                    <XAxis dataKey={areaChartConfig.xAxis} tickLine={false} axisLine={false} tickMargin={8} />
                                                    <YAxis dataKey={areaChartConfig.yAxis} tickLine={false} axisLine={false} tickMargin={8} />
                                                    <ChartTooltip content={<ChartTooltipContent />} />
                                                    <Area type="monotone" dataKey={areaChartConfig.yAxis} stroke="hsl(var(--chart-1))" fill="url(#fillArea)" />
                                                </AreaChart>
                                            </ChartContainer>
                                        ) : (
                                            <ChartPlaceholder message="No hay suficientes columnas numéricas o categóricas para mostrar este gráfico." />
                                        )}
                                    </CardContent>
                                </Card>
                                <Card className="lg:col-span-2">
                                    <CardHeader>
                                        <CardTitle>Distribución por Categoría</CardTitle>
                                        <CardDescription>
                                            {pieChartConfig.valueKey && pieChartConfig.labelKey ? (
                                                <>Mostrando <span className='font-semibold text-primary'>{pieChartConfig.valueKey}</span> por <span className='font-semibold text-primary'>{pieChartConfig.labelKey}</span>.</>
                                            ) : (
                                                <>Configura las claves para ver el gráfico.</>
                                            )}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-80">
                                        {(pieChartConfig.valueKey && pieChartConfig.labelKey) ? (
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
                                        ) : (
                                            <ChartPlaceholder message="No hay suficientes columnas numéricas o categóricas para mostrar este gráfico." />
                                        )}
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
                                        <CardTitle>Tasa de Éxito</CardTitle>
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
                                                        <Cell key="success" fill="hsl(var(--chart-2))" />
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
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Información del Archivo</CardTitle>
                                        <CardDescription>Detalles sobre la fuente de datos actual.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-sm">
                                        <div className='flex justify-between'>
                                            <span className='text-muted-foreground'>Nombre:</span>
                                            <span className='font-medium truncate text-right'>{fileMetadata?.filename}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-muted-foreground'>Filas:</span>
                                            <span className='font-medium'>{analysisResult.total_rows}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-muted-foreground'>Columnas:</span>
                                            <span className='font-medium'>{analysisResult.columns.length}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-muted-foreground'>Tamaño:</span>
                                            <span className='font-medium'>{fileMetadata?.size ? (fileMetadata.size / 1024).toFixed(2) : 'N/A'} KB</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <p className='text-xs text-muted-foreground'>Datos actualizados a las {new Date().toLocaleTimeString()}</p>
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
                    <div className="py-4 space-y-4 max-h-96 overflow-y-auto">
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
                            <UploadCloud className="mr-2"/> Cargar Nuevo Archivo
                        </Button>
                     </div>
                </DialogContent>
            </Dialog>

             {/* Save Project Modal */}
             <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
                <DialogContent>
                    <form onSubmit={handleSaveProject}>
                        <DialogHeader>
                            <DialogTitle>Guardar Proyecto de Análisis</DialogTitle>
                            <DialogDescription>
                                Guarda la configuración actual del dashboard y los datos para reutilizarlos más tarde.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="projectName">Nombre del Proyecto</Label>
                                <Input id="projectName" name="projectName" defaultValue={`Mi Análisis - ${new Date().toLocaleDateString()}`} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="projectDescription">Descripción (Opcional)</Label>
                                <Textarea id="projectDescription" name="projectDescription" placeholder="Ej: Análisis de ventas Q3 para la región norte." />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsSaveModalOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Guardar Proyecto
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
