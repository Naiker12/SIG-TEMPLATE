
'use client';

import { useState } from 'react';
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, GitCompareArrows, Loader2 } from "lucide-react";
import { useLoadingStore } from '@/hooks/use-loading-store';
import { DashboardSidebar } from '@/components/dashboard/sidebar';

const ComparisonPanel = ({ title, onFileSelect }: { title: string, onFileSelect: (file: File) => void }) => (
  <Card className="flex-1 flex flex-col border-2 border-accent">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>Sube el archivo que quieres comparar.</CardDescription>
    </CardHeader>
    <CardContent className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl m-6 mt-0 p-12">
       <div className="text-center">
          <FileUp className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="mt-4 text-muted-foreground">Arrastra y suelta o</p>
          <Button variant="outline" className="mt-2" onClick={() => {}}>
            Selecciona un Archivo
          </Button>
       </div>
    </CardContent>
  </Card>
);

export default function CompareViewPage() {
    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);
    const [result, setResult] = useState('');
    const { setIsLoading, isLoading } = useLoadingStore();

    const handleCompare = () => {
        setIsLoading(true);
        setResult('');
        setTimeout(() => {
            setResult('Análisis de comparación completado. Se encontraron 5 diferencias en el contenido del documento.');
            setIsLoading(false);
        }, 2000);
    }

  return (
    <div className="flex h-screen w-full">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
            <TopBar />
            <main className="flex-1 overflow-y-auto p-4 sm:px-6">
              <div className="max-w-7xl mx-auto w-full">
                <header className="mb-8">
                  <h1 className="text-3xl font-bold tracking-tight">Vista Comparativa</h1>
                  <p className="text-muted-foreground mt-1">
                    Compara dos documentos para ver las diferencias entre ellos.
                  </p>
                </header>

                <div className="flex flex-col lg:flex-row gap-8 mb-8">
                  <ComparisonPanel title="Documento Original" onFileSelect={setFile1} />
                  <ComparisonPanel title="Documento Revisado" onFileSelect={setFile2}/>
                </div>
                
                <div className="flex justify-center mb-8">
                  <Button size="lg" onClick={handleCompare} disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : <GitCompareArrows className="mr-2" />}
                    {isLoading ? 'Comparando...' : 'Comparar Documentos'}
                  </Button>
                </div>

                <Card className="border-2 border-accent">
                  <CardHeader>
                    <CardTitle>Resultados de la Comparación</CardTitle>
                    <CardDescription>Las diferencias detectadas se mostrarán aquí.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      value={isLoading ? 'Analizando documentos...' : result || 'Esperando comparación...'}
                      className="min-h-[200px] font-mono bg-muted/50" 
                      readOnly 
                    />
                  </CardContent>
                </Card>
              </div>
            </main>
        </div>
    </div>
  );
}
