
'use client';

import { useState } from 'react';
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, FileSpreadsheet, Settings, Check, Download, CloudUpload, Table2 } from "lucide-react";
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';


export default function ConvertToDatasetPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [dataset, setDataset] = useState<any>(null);
    
    const mockProcessedInfo = file ? {
        fileName: file.name,
        sheets: ['Ventas Q1', 'Ventas Q2', 'Ventas Q3', 'Ventas Q4'],
        rowCount: 4580,
    } : null;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
            setDataset(null);
        }
    };
    
    const handleConvert = () => {
        if (!file) return;
        setIsConverting(true);
        setTimeout(() => {
            setDataset({
                name: `Dataset de ${file.name.split('.')[0]}`,
                description: 'Dataset consolidado de las ventas trimestrales del año 2023.',
                rows: 4580,
                columns: 8,
                structure: [
                    { field: 'ID_Pedido', type: 'string' },
                    { field: 'Fecha', type: 'date' },
                    { field: 'Producto', type: 'string' },
                    { field: 'Cantidad', type: 'integer' },
                    { field: 'Precio_Unitario', type: 'float' },
                    { field: 'Total', type: 'float' },
                    { field: 'Cliente_ID', type: 'string' },
                    { field: 'Region', type: 'string' },
                ]
            });
            setIsConverting(false);
        }, 2000);
    }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <DashboardSidebar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <TopBar />
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              <div className="max-w-7xl mx-auto w-full">
                <header className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Conversión a Dataset</h1>
                  <p className="text-muted-foreground mt-2 max-w-3xl">
                    Transforma tus archivos Excel en datasets estructurados, listos para ser analizados o almacenados.
                  </p>
                </header>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  
                  {/* Columna de Configuración */}
                  <div className="space-y-8">
                      <Card className="shadow-lg border-2 border-accent">
                          <CardHeader>
                              <CardTitle>Paso 1: Cargar Archivo</CardTitle>
                              <CardDescription>Selecciona el archivo Excel que quieres convertir.</CardDescription>
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
                                  {file && <p className="text-muted-foreground text-sm mt-3 font-medium flex items-center gap-2"><FileSpreadsheet className="w-4 h-4"/>{file.name}</p>}
                                  {!file && <p className="text-muted-foreground text-sm mt-3">Formatos soportados: .csv, .xlsx, .xls</p>}
                              </div>
                          </CardContent>
                      </Card>

                      {file && (
                          <Card className="shadow-lg border-2 border-accent">
                              <CardHeader>
                                  <CardTitle>Paso 2: Configurar Dataset</CardTitle>
                                  <CardDescription>Define los parámetros para la creación de tu dataset.</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-6">
                                  <div className="space-y-2">
                                      <Label htmlFor="dataset-name">Nombre del Dataset</Label>
                                      <Input id="dataset-name" placeholder="Ej: Ventas Trimestrales" defaultValue={`Dataset de ${file.name.split('.')[0]}`}/>
                                  </div>
                                  <div className="space-y-2">
                                      <Label htmlFor="dataset-description">Descripción (Opcional)</Label>
                                      <Textarea id="dataset-description" placeholder="Añade una breve descripción..."/>
                                  </div>
                                  {mockProcessedInfo && (
                                  <div>
                                      <Label className="mb-3 block">Hojas a Incluir</Label>
                                      <div className="grid grid-cols-2 gap-3">
                                          {mockProcessedInfo.sheets.map(sheet => (
                                               <div key={sheet} className="flex items-center space-x-2">
                                                  <Checkbox id={sheet} defaultChecked />
                                                  <Label htmlFor={sheet} className="font-normal">{sheet}</Label>
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                                  )}
                                   <div>
                                      <Label className="mb-3 block">Modo de Conversión</Label>
                                       <RadioGroup defaultValue="combine" className="flex flex-col sm:flex-row gap-4">
                                          <div className="flex items-center space-x-2">
                                              <RadioGroupItem value="combine" id="combine" />
                                              <Label htmlFor="combine" className="font-normal">Combinar hojas</Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                              <RadioGroupItem value="separate" id="separate" />
                                              <Label htmlFor="separate" className="font-normal">Un dataset por hoja</Label>
                                          </div>
                                      </RadioGroup>
                                  </div>
                              </CardContent>
                          </Card>
                      )}
                  </div>

                  {/* Columna de Vista Previa y Acción */}
                   <div className="sticky top-24">
                       <Card className="shadow-lg min-h-[500px] flex flex-col border-2 border-accent">
                          <CardHeader>
                              <CardTitle>Paso 3: Convertir y Previsualizar</CardTitle>
                              <CardDescription>Ejecuta la conversión y revisa el resultado.</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col justify-between">
                              {!dataset && (
                                  <div className="flex-1 flex items-center justify-center border-2 border-dashed rounded-xl bg-muted/50 p-8 text-center">
                                      <div className="text-muted-foreground">
                                          <Table2 className="h-16 w-16 mx-auto mb-4" />
                                          <h3 className="text-lg font-semibold">La previsualización del dataset aparecerá aquí.</h3>
                                          <p>Completa los pasos anteriores para empezar.</p>
                                      </div>
                                  </div>
                              )}

                              {dataset && (
                                  <div className="space-y-4">
                                      <div>
                                          <h3 className="font-semibold text-lg">{dataset.name}</h3>
                                          <p className="text-sm text-muted-foreground">{dataset.description}</p>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4 text-center">
                                          <div className="bg-muted p-3 rounded-lg">
                                              <p className="text-sm text-muted-foreground">Filas</p>
                                              <p className="text-2xl font-bold">{dataset.rows}</p>
                                          </div>
                                          <div className="bg-muted p-3 rounded-lg">
                                              <p className="text-sm text-muted-foreground">Columnas</p>
                                              <p className="text-2xl font-bold">{dataset.columns}</p>
                                          </div>
                                      </div>
                                      <div>
                                          <h4 className="font-medium mb-2">Estructura del Dataset</h4>
                                          <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                                              {dataset.structure.map((field: any) => (
                                                  <div key={field.field} className="flex justify-between text-sm">
                                                      <span className="font-mono text-primary bg-primary/10 p-1 rounded-md text-xs">{field.field}</span>
                                                      <span className="text-muted-foreground">{field.type}</span>
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                  </div>
                              )}

                              <div className="mt-6 border-t pt-6 space-y-3">
                                  <Button size="lg" className="w-full" onClick={handleConvert} disabled={!file || isConverting}>
                                      <Settings className="mr-2"/>
                                      {isConverting ? 'Convirtiendo...' : (dataset ? 'Volver a Convertir' : 'Convertir a Dataset')}
                                  </Button>
                                  {dataset && (
                                      <div className="grid grid-cols-2 gap-3">
                                          <Button variant="outline" className="w-full">
                                              <Download className="mr-2"/>
                                              Descargar
                                          </Button>
                                           <Button variant="outline" className="w-full">
                                              <CloudUpload className="mr-2"/>
                                              Guardar
                                          </Button>
                                      </div>
                                  )}
                              </div>
                          </CardContent>
                       </Card>
                  </div>

                </div>
              </div>
            </main>
        </div>
    </div>
  );
}
