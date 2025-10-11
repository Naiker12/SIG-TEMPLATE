
'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UploadCloud, PlusCircle, Trash2, Play, AlertTriangle, CheckCircle, FileSpreadsheet } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { AnimatePresence, motion } from 'framer-motion';
import { CircularProgressBar } from '@/components/ui/circular-progress-bar';


export default function FormatValidationPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [validationProgress, setValidationProgress] = useState(0);
    const [validationResult, setValidationResult] = useState<any>(null);

    const [rules, setRules] = useState([
        { id: 1, column: "email", rule: "is_email", label: "Es un email válido" },
        { id: 2, column: "order_total", rule: "is_not_empty", label: "No está vacío" },
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
        setIsValidating(true);
        setValidationProgress(0);
        setValidationResult(null);
        
        const progressInterval = setInterval(() => {
            setValidationProgress(prev => {
                if (prev >= 95) {
                    clearInterval(progressInterval);
                    return 95;
                }
                return prev + 10;
            });
        }, 200);

        setTimeout(() => {
            clearInterval(progressInterval);
            setValidationProgress(100);
            setValidationResult({
                summary: { totalRows: 100, validRows: 92, invalidRows: 8 },
                errors: [
                    { row: 15, column: "email", value: "ana.t", error: "No es un email válido" },
                    { row: 28, column: "order_total", value: "", error: "El campo no puede estar vacío" },
                    { row: 45, column: "country", value: "USA", error: "Valor no permitido" },
                    { row: 73, column: "email", value: "luis.g@", error: "No es un email válido" },
                ]
            });
            setIsValidating(false);
        }, 2500);
    }

    const renderContent = () => {
        if (isValidating) {
            return (
                <motion.div key="progress" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                    <CircularProgressBar progress={validationProgress} message="Validando archivo..." />
                </motion.div>
            );
        }

        if (!validationResult) {
            return (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full flex flex-col items-center justify-center text-center p-8"
                >
                    <AlertTriangle className="h-20 w-20 text-muted-foreground mb-4"/>
                    <h3 className="text-xl font-semibold mb-2">Resultados del Análisis</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">Los resultados del análisis de validación aparecerán aquí una vez que ejecutes el proceso.</p>
                </motion.div>
            )
        }

        return (
            <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='space-y-8 w-full'
            >
                <Card className="bg-muted/30">
                    <CardHeader className="flex-row items-center gap-6 space-y-0">
                        <div className="h-28 w-28 flex-shrink-0">
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
                                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><CheckCircle className="h-4 w-4 text-green-500"/>Filas Válidas</p>
                                <p className="text-2xl font-bold">{validationResult.summary.validRows}</p>
                            </div>
                                <div className="text-center p-3 bg-background rounded-lg">
                                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><AlertTriangle className="h-4 w-4 text-red-500"/>Filas Inválidas</p>
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
            </motion.div>
        )
    }

    return (
        <>
            <TopBar />
            <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 overflow-auto pb-8">
                <div className="max-w-7xl mx-auto w-full">
                    <header className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Validación de Formato</h1>
                        <p className="text-muted-foreground mt-2 max-w-3xl">
                            Define reglas para asegurar la calidad y consistencia de tus datos antes de procesarlos.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Columna de Configuración */}
                        <div className="space-y-8 lg:sticky lg:top-24">
                            <Card className="shadow-lg border-2 border-accent">
                                <CardHeader>
                                    <CardTitle>Paso 1: Cargar Archivo</CardTitle>
                                    <CardDescription>Selecciona un archivo Excel o CSV.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {file ? (
                                         <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <FileSpreadsheet className="w-8 h-8 text-primary flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="font-semibold truncate">{file.name}</p>
                                                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                                                <Trash2 className="w-5 h-5 text-destructive" /><span className="sr-only">Quitar Archivo</span>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl text-center">
                                            <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" />
                                            <Button asChild variant="outline">
                                                <label htmlFor="file-upload" className="cursor-pointer">Seleccionar Archivo</label>
                                            </Button>
                                            <Input id="file-upload" type="file" onChange={handleFileChange} accept=".xlsx, .xls, .csv" className="hidden" />
                                            <p className="text-muted-foreground text-sm mt-3">Formatos soportados: .csv, .xlsx, .xls</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg border-2 border-accent">
                                <CardHeader>
                                    <CardTitle>Paso 2: Definir Reglas</CardTitle>
                                    <CardDescription>Añade reglas de validación para las columnas.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                        {rules.map((r) => (
                                            <div key={r.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                                <div className='text-sm space-x-2'>
                                                    <span className='font-mono bg-primary/10 text-primary p-1 rounded-md'>{r.column}</span>
                                                    <span className='font-semibold'>{r.label}</span>
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
                        </div>
                        
                        {/* Columna de Resultados */}
                        <div className="space-y-8">
                             <Card className="shadow-lg min-h-[600px] border-2 border-accent">
                                <CardHeader>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <CardTitle>Paso 3: Resultados de la Validación</CardTitle>
                                            <CardDescription>Resumen de la calidad de los datos.</CardDescription>
                                        </div>
                                        <Button onClick={handleValidate} disabled={!file || isValidating} size="lg">
                                            <Play className="mr-2" /> {isValidating ? 'Validando...' : (validationResult ? 'Validar de Nuevo' : 'Ejecutar Validación')}
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex items-center justify-center min-h-[400px]">
                                    <AnimatePresence mode="wait">
                                        {renderContent()}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
