
import { Database, FileInput, UploadCloud, Type, Filter, Trash2, Rows, Calculator, Sigma, BarChart, LineChart, PieChart, FileOutput, Download, Workflow } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NodeDefinition = {
    type: string;
    title: string;
    description: string;
    icon: React.ReactNode;
};

export type NodeCategory = {
    id: string;
    title: string;
    icon: string;
    nodes: NodeDefinition[];
};

export const NODE_CATEGORIES: NodeCategory[] = [
    {
        id: 'input',
        title: 'Cargar Datos',
        icon: '🟦',
        nodes: [
            { type: 'fileInput', title: 'Archivo Local', description: 'Carga un archivo CSV o Excel desde tu computador.', icon: <FileInput /> },
            { type: 'dbInput', title: 'Base de Datos', description: 'Conéctate a una base de datos para extraer datos.', icon: <Database /> },
            { type: 'apiInput', title: 'API Externa', description: 'Importa datos desde un punto final de API REST.', icon: <UploadCloud /> },
        ]
    },
    {
        id: 'transform',
        title: 'Transformación',
        icon: '🟨',
        nodes: [
            { type: 'changeType', title: 'Cambiar Tipo de Dato', description: 'Modifica el tipo de una columna (ej. texto a número).', icon: <Type /> },
            { type: 'renameColumn', title: 'Renombrar Columna', description: 'Cambia el nombre de una o más columnas.', icon: <Rows /> },
        ]
    },
    {
        id: 'clean',
        title: 'Limpieza y Filtrado',
        icon: '🟩',
        nodes: [
            { type: 'filterRows', title: 'Filtrar Filas', description: 'Elimina filas basadas en una condición.', icon: <Filter /> },
            { type: 'removeDuplicates', title: 'Eliminar Duplicados', description: 'Quita filas que son idénticas.', icon: <Trash2 /> },
        ]
    },
    {
        id: 'analyze',
        title: 'Análisis y Cálculos',
        icon: '🟧',
        nodes: [
            { type: 'calculateColumn', title: 'Columna Calculada', description: 'Crea una nueva columna a partir de una fórmula.', icon: <Calculator /> },
            { type: 'aggregateData', title: 'Agrupar y Agregar', description: 'Realiza cálculos como suma, promedio, etc.', icon: <Sigma /> },
        ]
    },
    {
        id: 'visualize',
        title: 'Visualización',
        icon: '🟪',
        nodes: [
            { type: 'barChart', title: 'Gráfico de Barras', description: 'Muestra los datos en un gráfico de barras.', icon: <BarChart /> },
            { type: 'lineChart', title: 'Gráfico de Líneas', description: 'Visualiza tendencias a lo largo del tiempo.', icon: <LineChart /> },
            { type: 'pieChart', title: 'Gráfico de Pastel', description: 'Muestra la proporción de categorías.', icon: <PieChart /> },
        ]
    },
    {
        id: 'output',
        title: 'Exportación y Salida',
        icon: '🟥',
        nodes: [
             { type: 'fileOutput', title: 'Exportar a Archivo', description: 'Guarda el resultado como CSV o Excel.', icon: <FileOutput /> },
             { type: 'downloadOutput', title: 'Descargar Resultado', description: 'Descarga los datos directamente en tu navegador.', icon: <Download /> },
        ]
    },
    {
        id: 'control',
        title: 'Control de Flujo',
        icon: '💡',
        nodes: [
            { type: 'mergeFlows', title: 'Unir Flujos', description: 'Combina los resultados de dos flujos de datos.', icon: <Workflow /> },
        ]
    }
];
