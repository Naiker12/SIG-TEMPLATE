import { FileUp, BrainCircuit, FileCheck, AlertTriangle } from "lucide-react";
import { MetricCard } from "./metric-card";

export function DashboardOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard 
        title="Archivos Subidos"
        value="1,250"
        change="+20 archivos este mes"
        icon={<FileUp className="h-6 w-6 text-muted-foreground" />}
      />
       <MetricCard 
        title="Tokens de IA Usados"
        value="5,832"
        change="+15% desde la semana pasada"
        icon={<BrainCircuit className="h-6 w-6 text-muted-foreground" />}
      />
       <MetricCard 
        title="Archivos Analizados"
        value="1,180"
        change="4 pendientes"
        icon={<FileCheck className="h-6 w-6 text-muted-foreground" />}
      />
       <MetricCard 
        title="Errores de Análisis"
        value="23"
        change="1 la última hora"
        icon={<AlertTriangle className="h-6 w-6 text-muted-foreground" />}
      />
    </div>
  );
}
