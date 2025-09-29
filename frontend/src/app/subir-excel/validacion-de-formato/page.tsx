
'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UploadCloud, PlusCircle, Trash2, Play, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { useLoadingStore } from '@/hooks/use-loading-store';


export default function FormatValidationPage() {
    const [file, setFile] = useState<File | null>(null);
    const [validationResult, setValidationResult] = useState<any>(null);
    const { setIsLoading, isLoading } = useLoadingStore();
    const [rules, setRules] = useState([
        { id: 1, column: "email", rule: "is_email" },
        { id: 2, column: "order_total", rule: "is_not_empty" },
    ]);

    const chartData = validationResult ? [
      { name: 'Filas Válidas', value: validationResult.summary.validRows, color: 'hsl(var(--chart-1))' },
      { name: 'Filas Inválidas', value: validationResult.summary.invalidRows, color: 'hsl(var(--destructive))' },
    ] : [];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
            setValidationResult(null);
        }
    };
    
    const handleValidate = () => {
        if (!file) return;
        setIsLoading(true);
        setTimeout(() => {
            setValidationResult({
                summary: { totalRows: 100, validRows: 92, invalidRows: 8 },
                errors: [
                    { row: 15, column: "email", value: "ana.t", error: "No es un email válido" },
                    { row: 28, column: "order_total", value: "", error: "El campo no puede estar vacío" },
                    { row: 45, column: "country", value: "USA", error: "Valor no permitido" },
                    { row: 73, column: "email", value: "luis.g@", error: "No es un email válido" },
                ]
            });
            setIsLoading(false);
        }, 1500);
    }

    return (
        <SidebarProvider>
            <Sidebar variant="sidebar" collapsible="icon">
                <DashboardSidebar />
            </Sidebar>
            <SidebarInset>
                <main className="min-h-screen bg-background">
                    <TopBar />
                    <div className="p-4 sm:p-6 lg:p-8">
                        <div className="max-w-7xl mx-auto">
                            <header className="mb-8">
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Validación de Formato</h1>
                                <p className="text-muted-foreground mt-2 max-w-3xl">
                                    Define reglas para asegurar la calidad y consistencia de tus datos antes de procesarlos.
                                </p>
                            </header>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                <div className="lg:col-span-1 space-y-6">
                                    <Card className="shadow-lg border-2 border-accent">
                                        <CardHeader>
                                            <CardTitle>Paso 1: Cargar Archivo</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl text-center">
                                                <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" />
                                                <Button asChild variant="outline">
                                                    <label htmlFor="file-upload" className="cursor-pointer">
                                                        {file ? "Cambiar Archivo" : "Seleccionar Archivo"}
                                                    </label>
                                                </Button>
                                                <Input id="file-upload" type="file" onChange={handleFileChange} accept=".xlsx, .xls, .csv" className="hidden" />
                                                <p className="text-muted-foreground text-sm mt-3">
                                                    {file ? file.name : "Formatos soportados: .csv, .xlsx, .xls"}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-lg border-2 border-accent">
                                        <CardHeader>
                                            <CardTitle>Paso 2: Definir Reglas</CardTitle>
                                            <CardDescription>Añade reglas de validación.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-3">
                                                {rules.map((r) => (
                                                    <div key={r.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                                        <div className='text-sm'>
                                                            <span className='font-mono bg-primary/10 text-primary p-1 rounded-md'>{r.column}</span>
                                                            <span className='mx-2 text-muted-foreground'>-&gt;</span>
                                                            <span className='font-semibold'>{r.rule.replace(/_/g, ' ')}</span>
                                                        </div>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7"><Trash2 className="w-4 h-4 text-destructive"/></Button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="pt-4 border-t space-y-3">
                                                <Label>Añadir Nueva Regla</Label>
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <Input placeholder="Nombre de columna" className="flex-1" />
                                                    <Select>
                                                        <SelectTrigger className="flex-1">
                                                            <SelectValue placeholder="Selecciona una regla" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="not_empty">No está vacío</SelectItem>
                                                            <SelectItem value="is_email">Es un email válido</SelectItem>
                                                            <SelectItem value="is_number">Es un número</SelectItem>
                                                            <SelectItem value="contains_text">Contiene texto</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <Button variant="outline" className="w-full">
                                                    <PlusCircle className="mr-2" /> Añadir Regla
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Button onClick={handleValidate} disabled={!file || isLoading} size="lg" className="w-full">
                                        <Play className="mr-2" /> {isLoading ? 'Validando...' : 'Ejecutar Validación'}
                                    </Button>
                                </div>

                                <div className="lg:col-span-2">
                                    <Card className="shadow-lg min-h-[600px] border-2 border-accent">
                                        <CardHeader>
                                            <CardTitle>Paso 3: Resultados de la Validación</CardTitle>
                                            <CardDescription>Resumen de la calidad de los datos.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {isLoading && <div className="text-center p-12">Cargando resultados...</div>}
                                            {!isLoading && !validationResult && <div className="text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg">Los resultados aparecerán aquí.</div>}
                                            {validationResult && (
                                                <div className='space-y-8'>
                                                    <Card className="bg-muted/30">
                                                        <CardHeader className="flex-row items-center gap-6 space-y-0">
                                                            <div className="h-28 w-28">
                                                                <ResponsiveContainer width="100%" height="100%">
                                                                    <PieChart>
                                                                        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={30} outerRadius={45} paddingAngle={2} strokeWidth={0}>
                                                                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                                                        </Pie>
                                                                        <Tooltip contentStyle={{background: "hsl(var(--background))", borderRadius: "var(--radius)"}}/>
                                                                    </PieChart>
                                                                </ResponsiveContainer>
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                                                                <div className="text-center p-3 bg-background rounded-lg">
                                                                    <p className="text-sm text-muted-foreground">Filas Totales</p>
                                                                    <p className="text-2xl font-bold">{validationResult.summary.totalRows}</p>
                                                                </div>
                                                                 <div className="text-center p-3 bg-background rounded-lg">
                                                                    <p className="text-sm text-muted-foreground flex items-center justify-center"><CheckCircle className="h-4 w-4 mr-1 text-green-500"/>Filas Válidas</p>
                                                                    <p className="text-2xl font-bold">{validationResult.summary.validRows}</p>
                                                                </div>
                                                                 <div className="text-center p-3 bg-background rounded-lg">
                                                                    <p className="text-sm text-muted-foreground flex items-center justify-center"><AlertTriangle className="h-4 w-4 mr-1 text-red-500"/>Filas Inválidas</p>
                                                                    <p className="text-2xl font-bold">{validationResult.summary.invalidRows}</p>
                                                                </div>
                                                            </div>
                                                        </CardHeader>
                                                    </Card>
                                                    
                                                    <div>
                                                        <h3 className="font-semibold mb-2">Detalle de Errores</h3>
                                                        <div className="border rounded-lg overflow-x-auto">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead>Fila</TableHead>
                                                                        <TableHead>Columna</TableHead>
                                                                        <TableHead>Valor Encontrado</TableHead>
                                                                        <TableHead>Error</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {validationResult.errors.map((err: any, i: number) => (
                                                                        <TableRow key={i}>
                                                                            <TableCell>{err.row}</TableCell>
                                                                            <TableCell>
                                                                                <Badge variant="outline">{err.column}</Badge>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Badge variant="secondary" className='font-mono'>{err.value || '""'}</Badge>
                                                                            </TableCell>
                                                                            <TableCell className="text-destructive">{err.error}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
