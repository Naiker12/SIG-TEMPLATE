
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bot, FileSearch } from 'lucide-react';

export function AnalyticsView() {
  return (
    <Card className="min-h-[400px]">
        <CardHeader>
            <CardTitle>Analytics Dashboard</CardTitle>
            <CardDescription>A detailed view of your data will be available here soon.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full">
             <div className="text-center text-muted-foreground p-8">
                <div className="inline-flex items-center justify-center p-6 bg-primary/10 rounded-full mb-6">
                    <BarChart className="h-16 w-16 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Análisis Avanzado en Construcción</h2>
                <p className="max-w-md mx-auto">
                    Estamos preparando visualizaciones y análisis detallados de tus datos. ¡Vuelve pronto!
                </p>
            </div>
        </CardContent>
    </Card>
  );
}
