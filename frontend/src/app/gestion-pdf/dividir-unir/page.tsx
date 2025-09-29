
'use client';

import { useState } from "react";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploadForm } from "@/components/gestion-pdf/file-upload-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DraggableFileItem } from "@/components/gestion-pdf/draggable-file-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, X } from "lucide-react";

export default function SplitMergePdfPage() {
  const [splitFile, setSplitFile] = useState<File[]>([]);
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState('split');

  const handleFileRemove = (fileToRemove: File, type: 'split' | 'merge') => {
    if (type === 'split') {
        setSplitFile([]);
    } else {
        setMergeFiles(files => files.filter(f => f !== fileToRemove));
    }
  }

  const handleDragEnd = (result: File[]) => {
    setMergeFiles(result);
  };

  const SplitFilePreview = () => (
    <div className="mt-6 space-y-3">
        <h3 className='text-lg font-medium text-muted-foreground'>Archivo para dividir:</h3>
        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
            <div className="flex items-center gap-4 min-w-0">
                <FileText className="w-6 h-6 text-primary flex-shrink-0" />
                <div className="min-w-0">
                    <p className="font-semibold truncate">{splitFile[0].name}</p>
                    <p className="text-sm text-muted-foreground">
                        {(splitFile[0].size / 1024 / 1024).toFixed(2)} MB
                    </p>
                </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleFileRemove(splitFile[0], 'split')}>
                <X className="w-5 h-5 text-destructive" />
                <span className="sr-only">Remove file</span>
            </Button>
        </div>
    </div>
  );

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <DashboardSidebar />
      </Sidebar>
      <SidebarInset>
        <main className="min-h-screen bg-background">
          <TopBar />
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight">Dividir y Unir PDF</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  Organiza tus documentos PDF dividiendo archivos grandes o uniendo varios archivos en uno solo.
                </p>
              </header>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="split">Dividir PDF</TabsTrigger>
                  <TabsTrigger value="merge">Unir PDF</TabsTrigger>
                </TabsList>
                
                <TabsContent value="split">
                  <Card className="shadow-lg rounded-2xl mt-6 border-2 border-accent">
                    <CardContent className="p-6">
                      <FileUploadForm 
                        action="split" 
                        files={splitFile}
                        onFilesSelected={setSplitFile}
                        acceptedFileTypes={{'application/pdf': ['.pdf']}}
                        uploadHelpText="Sube un archivo PDF para dividir."
                      />
                      {splitFile.length > 0 && <SplitFilePreview />}
                       <div className="mt-6 space-y-4">
                        <Label htmlFor="ranges" className="text-lg font-medium">Rangos de Páginas</Label>
                        <Input id="ranges" placeholder="Ej: 1-3, 5, 8-10" disabled={splitFile.length === 0} />
                        <p className="text-sm text-muted-foreground">
                          Define las páginas o rangos que quieres extraer. Separa los números o rangos con comas.
                        </p>
                      </div>
                      <div className="flex justify-end pt-6 border-t mt-6">
                        <Button size="lg" disabled={splitFile.length === 0}>Dividir PDF</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="merge">
                  <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                      <Card className="shadow-lg rounded-2xl border-2 border-accent">
                        <CardContent className="p-6">
                           <FileUploadForm 
                             action="merge" 
                             allowMultiple 
                             files={mergeFiles}
                             onFilesSelected={setMergeFiles}
                             acceptedFileTypes={{'application/pdf': ['.pdf']}}
                             uploadHelpText="Sube o arrastra archivos PDF para unirlos."
                           />
                        </CardContent>
                      </Card>
                      {mergeFiles.length > 0 && (
                        <Card className="shadow-lg rounded-2xl border-2 border-accent">
                          <CardContent className="p-6">
                             <h3 className="text-lg font-medium mb-4">Arrastra para ordenar los archivos</h3>
                             <ScrollArea className="h-72">
                                <div className="space-y-3 pr-4">
                                  {mergeFiles.map((file, index) => (
                                    <DraggableFileItem 
                                      key={file.name + index}
                                      file={file}
                                      index={index}
                                      files={mergeFiles}
                                      onRemove={(f) => handleFileRemove(f, 'merge')}
                                      onDragEnd={handleDragEnd}
                                    />
                                  ))}
                                </div>
                              </ScrollArea>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    <div className="lg:col-span-1">
                       <Card className="shadow-lg rounded-2xl sticky top-24 border-2 border-accent">
                          <CardHeader>
                            <h3 className="text-xl font-semibold">Vista Previa</h3>
                          </CardHeader>
                          <CardContent>
                            <div className="aspect-[3/4] w-full bg-muted rounded-lg flex items-center justify-center border border-dashed">
                              <div className="text-center text-muted-foreground p-4">
                                <FileText className="mx-auto h-12 w-12" />
                                <p className="mt-2 text-sm">
                                  {mergeFiles.length > 0 ? `Primera página de '${mergeFiles[0].name}'` : "La vista previa aparecerá aquí."}
                                </p>
                              </div>
                            </div>
                             <Button size="lg" className="w-full mt-6" disabled={mergeFiles.length < 2}>
                                Unir {mergeFiles.length > 0 ? mergeFiles.length : ''} PDFs
                             </Button>
                          </CardContent>
                       </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    