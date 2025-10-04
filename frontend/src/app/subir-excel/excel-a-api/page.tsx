
'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, DatabaseZap, TableIcon, Code, FileSpreadsheet } from "lucide-react";
import { DataTable } from '@/components/limpieza-de-datos/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ActiveApisModal } from '@/components/excel-a-api/active-apis-modal';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CircularProgressBar } from '@/components/ui/circular-progress-bar';

const mockExcelData = [
    { id: "row-1", "ID Cliente": "C001", "Nombre": "Ana", "Apellido": "Torres", "Email": "ana.t@example.com", "País": "España", "Último Pedido": "2024-08-15" },
    { id: "row-2", "ID Cliente": "C002", "Nombre": "Luis", "Apellido": "Gomez", "Email": "luis.g@example.com", "País": "México", "Último Pedido": "2024-08-12" },
    { id: "row-3", "ID Cliente": "C003", "Nombre": "Carla", "Apellido": "Diaz", "Email": "carla.d@example.com", "País": "Argentina", "Último Pedido": "2024-08-10" },
    { id: "row-4", "ID Cliente": "C004", "Nombre": "Jorge", "Apellido": "Perez", "Email": "jorge.p@example.com", "País": "Colombia", "Último Pedido": "2024-08-20" },
];

export default function ExcelToApiPage() {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [isApiModalOpen, setIsApiModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const newFile = event.target.files[0];
            setFile(newFile);
            setIsProcessing(true);
            setProgress(0);
            setData([]);

            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 95) {
                        clearInterval(progressInterval);
                        return 95;
                    }
                    return prev + 10;
                });
            }, 200);

            setTimeout(() => {
                clearInterval(progressInterval);
                setProgress(100);
                setData(mockExcelData);
                setIsProcessing(false);
            }, 2500);
        }
    };
    
     const columns: ColumnDef<any>[] = useMemo(() => {
        if (data.length === 0) return [];
        const headers = Object.keys(data[0]);
        return headers.map(header => ({
            accessorKey: header,
            header: header,
            cell: ({ row }: any) => <div>{row.getValue(header)}</div>,
        }));
    }, [data]);
    
    const UploadSheet = () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button>Procesar Otro Archivo</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Cargar Nuevo Archivo</SheetTitle>
                    <SheetDescription>
                        Selecciona un nuevo archivo Excel o CSV para convertirlo en una API.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl text-center mt-6">
                    <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" />
                    <Button asChild variant="outline">
                        <Label htmlFor="file-upload-sheet" className="cursor-pointer">
                            Seleccionar Archivo
                        </Label>
                    </Button>
                    <Input id="file-upload-sheet" type="file" onChange={handleFileChange} accept=".csv, .xlsx, .xls" className="hidden" />
                    <p className="text-muted-foreground text-sm mt-4">Formatos soportados: .csv, .xlsx, .xls</p>
                </div>
            </SheetContent>
        </Sheet>
    );

    return (
        <>
            <TopBar />
            <main className="flex-1 gap-4 p-4 sm:px-6 md:gap-8 pb-8">
                <div className="max-w-full mx-auto w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <header>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Excel a API</h1>
                            <p className="text-muted-foreground mt-2 max-w-3xl">
                                Convierte tus archivos Excel en puntos finales de API dinámicos con solo unos clics.
                            </p>
                        </header>
                         <div className="flex items-center gap-2">
                            {data.length > 0 && <UploadSheet />}
                            <Button size="lg" variant="outline" onClick={() => setIsApiModalOpen(true)}>
                                <DatabaseZap className="mr-2" />
                                Mis APIs Activas
                            </Button>
                         </div>
                    </div>
                    
                    <AnimatePresence mode="wait">
                        {data.length === 0 && !isProcessing ? (
                             <motion.div key="upload" className="w-full">
                                <Card className="shadow-lg max-w-4xl mx-auto border-2 border-accent min-h-[450px]">
                                    <CardContent className="h-full flex flex-col justify-center items-center p-6">
                                        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl text-center flex-1 w-full">
                                            <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" />
                                            <h3 className="text-xl font-semibold mb-2">Arrastra y suelta tu archivo Excel o CSV</h3>
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
                            </motion.div>
                        ) : (
                            <motion.div key="data" className="w-full">
                                <Card className="border-2 border-accent shadow-lg min-h-[450px]">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileSpreadsheet /> {isProcessing ? 'Procesando Archivo' : 'Vista Previa de Datos'}
                                        </CardTitle>
                                        <CardDescription>
                                            {isProcessing ? `Procesando el archivo ${file?.name}...` : `Los datos de tu archivo ${file?.name} están listos.`}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {isProcessing ? (
                                            <div className="flex items-center justify-center min-h-[300px]">
                                                <CircularProgressBar progress={progress} message="Procesando..." />
                                            </div>
                                        ) : (
                                            <Tabs defaultValue="table" className="w-full">
                                                <TabsList>
                                                    <TabsTrigger value="table"><TableIcon className="mr-2" />Tabla</TabsTrigger>
                                                    <TabsTrigger value="json"><Code className="mr-2" />JSON</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="table" className="mt-4">
                                                    <DataTable columns={columns} data={data} />
                                                </TabsContent>
                                                <TabsContent value="json" className="mt-4 flex min-h-[500px]">
                                                    <Textarea
                                                        readOnly
                                                        value={JSON.stringify(data, null, 2)}
                                                        className="flex-1 bg-muted/50 font-mono text-xs"
                                                    />
                                                </TabsContent>
                                            </Tabs>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
            <ActiveApisModal isOpen={isApiModalOpen} onOpenChange={setIsApiModalOpen} />
        </>
    );
}
