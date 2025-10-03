
'use client';

import { useState, useMemo } from 'react';
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileUp, Sparkles, Eye, FileSpreadsheet, X, ChevronDown } from 'lucide-react';
import { DataTable } from '@/components/limpieza-de-datos/data-table';
import { ColumnDef } from '@tanstack/react-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from '@/lib/utils';
import { useLoadingStore } from '@/hooks/use-loading-store';

const transformationOptions = [
    { id: "standardize-names", label: "Estandarizar nombres propios" },
    { id: "normalize-cities", label: 'Normalizar ciudades (ej: "Cartajena" → "Cartagena")' },
    { id: "format-dates", label: "Corregir formato de fechas (YYYY-MM-DD)" },
    { id: "validate-emails", label: "Convertir correos a minúscula y validar" },
    { id: "remove-duplicates", label: "Eliminar duplicados y vacíos" },
];

export default function DataTransformationPage() {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [exportFormat, setExportFormat] = useState('csv');
    const [isOptionsOpen, setIsOptionsOpen] = useState(true);
    const { setIsLoading, isLoading } = useLoadingStore();


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setIsLoading(true);
            setTimeout(() => {
                const mockData = [
                    { id: 1, nombre: "ana sofia", email: "  ANA.S@EMAIL.COM", ciudad: "Cartajena", fecha_registro: "15/03/2023" },
                    { id: 2, nombre: "luis felipe", email: "luis.f@email.com", ciudad: "Bogotá", fecha_registro: "2023-01-20" },
                    { id: 1, nombre: "ana sofia", email: "  ANA.S@EMAIL.COM", ciudad: "Cartajena", fecha_registro: "15/03/2023" },
                    { id: 3, nombre: "Carlos", email: "carlos@", ciudad: "Medellin", fecha_registro: "10-05-2023" },
                    { id: 4, nombre: "", email: "user@email.com", ciudad: "Cali", fecha_registro: "01/02/2023" },
                ];
                setData(mockData);
                setIsLoading(false);
            }, 1500);
        }
    };
    
    const handleRemoveFile = () => {
        setFile(null);
        setData([]);
    }
    
    const columns: ColumnDef<any>[] = useMemo(() => {
        if (data.length === 0) return [];
        const headers = Object.keys(data[0]);
        return headers.map(header => ({
            accessorKey: header,
            header: header,
            cell: ({ row }: any) => <div>{row.getValue(header)}</div>,
        }));
    }, [data]);
    
    const PreviewModal = () => (
       <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="lg" disabled={!data.length}>
                    <Eye className="mr-2" /> Previsualizar Cambios
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Vista Previa de Datos Transformados ({exportFormat.toUpperCase()})</DialogTitle>
                    <DialogDescription>
                        Así se verán tus datos después de aplicar las transformaciones seleccionadas.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-auto rounded-lg border p-4">
                    {exportFormat === 'json' ? (
                        <Textarea 
                            readOnly 
                            value={JSON.stringify(data.slice(0, 5), null, 2)} 
                            className="min-h-[400px] bg-muted/50 font-mono text-xs"
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <DataTable columns={columns} data={data.slice(0, 5)} />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <DashboardSidebar />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <TopBar />
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <div className="max-w-full mx-auto w-full">
                        <header className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Transformación y Estandarización</h1>
                            <p className="text-muted-foreground mt-2 max-w-3xl">
                                Carga, limpia y estandariza tus archivos de datos en un flujo de trabajo guiado.
                            </p>
                        </header>

                        {!file && !data.length ? (
                            <Card className="shadow-lg max-w-4xl mx-auto border-2 border-accent min-h-[450px]">
                                <CardContent className="h-full flex flex-col justify-center items-center p-6">
                                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl text-center flex-1 w-full">
                                        <FileUp className="w-16 h-16 text-muted-foreground mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">Arrastra y suelta tus archivos aquí</h3>
                                        <p className="text-muted-foreground mb-4">o</p>
                                        <Button asChild variant="default">
                                            <Label htmlFor="file-upload" className="cursor-pointer">
                                                Seleccionar Archivo
                                            </Label>
                                        </Button>
                                        <Input id="file-upload" type="file" onChange={handleFileChange} accept=".csv, .xlsx, .xls" className="hidden" />
                                        <p className="text-muted-foreground text-sm mt-4">Formatos soportados: .csv, .xlsx, .xls</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className='space-y-8'>
                                {data.length > 0 && (
                                    <>
                                        <Card className="border-2 border-accent shadow-lg">
                                            <CardHeader>
                                                <div className='flex justify-between items-center'>
                                                    <div>
                                                      <CardTitle>Visualización de Datos</CardTitle>
                                                      <CardDescription>Revisa tus datos y selecciona las transformaciones a aplicar.</CardDescription>
                                                    </div>
                                                    <div className='flex items-center gap-4'>
                                                        {file && (
                                                          <div className='flex items-center gap-2 text-sm font-medium p-2 rounded-lg bg-muted'>
                                                              <FileSpreadsheet className="w-5 h-5" />
                                                              <span>{file.name}</span>
                                                          </div>
                                                        )}
                                                        <Button variant="destructive" size="icon" onClick={handleRemoveFile}>
                                                            <X className="w-5 h-5"/>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="overflow-x-auto">
                                                <DataTable columns={columns} data={data} />
                                            </CardContent>
                                        </Card>

                                        <Collapsible open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
                                            <Card className="border-2 border-accent shadow-lg">
                                                <CollapsibleTrigger asChild>
                                                    <div className='flex justify-between items-center p-6 cursor-pointer'>
                                                       <div>
                                                        <CardTitle>Opciones de Transformación</CardTitle>
                                                         <CardDescription>Selecciona las reglas de limpieza a aplicar.</CardDescription>
                                                        </div>
                                                        <Button variant="ghost" size="icon">
                                                            <ChevronDown className={cn("h-5 w-5 transition-transform", isOptionsOpen && 'rotate-180')}/>
                                                        </Button>
                                                    </div>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {transformationOptions.map(option => (
                                                            <div key={option.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border hover:border-primary/50 transition-colors">
                                                                <Checkbox id={option.id} defaultChecked={option.id === 'remove-duplicates'} />
                                                                <Label htmlFor={option.id} className="text-sm font-normal leading-tight cursor-pointer flex-1">{option.label}</Label>
                                                            </div>
                                                        ))}
                                                    </CardContent>
                                                </CollapsibleContent>
                                            </Card>
                                        </Collapsible>
                                        
                                        <Card className="border-2 border-accent shadow-lg">
                                            <CardHeader>
                                                <CardTitle>Exportar Datos Limpios</CardTitle>
                                                <CardDescription>Elige el formato final para tus datos transformados.</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <RadioGroup defaultValue={exportFormat} onValueChange={setExportFormat} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {['CSV', 'Excel', 'JSON', 'SQL'].map(format => {
                                                        const value = format.toLowerCase().includes('excel') ? 'xlsx' : format.toLowerCase();
                                                        return (
                                                            <div key={format}>
                                                                <RadioGroupItem value={value} id={format} className="peer sr-only" />
                                                                <Label htmlFor={format} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors">
                                                                    {format}
                                                                </Label>
                                                            </div>
                                                        )
                                                    })}
                                                </RadioGroup>
                                            </CardContent>
                                            <CardFooter className="flex flex-col sm:flex-row gap-4 border-t pt-6 mt-6">
                                                <PreviewModal />
                                                <Button size="lg" disabled={!data.length}>
                                                    <Sparkles className="mr-2" /> Procesar y Exportar
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
