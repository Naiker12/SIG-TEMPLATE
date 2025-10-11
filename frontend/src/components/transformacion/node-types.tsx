
import { Database, FileInput, UploadCloud, Type, Filter, Trash2, Rows, Calculator, Sigma, BarChart, LineChart, PieChart, FileOutput, Download, Workflow, Split, GitMerge } from 'lucide-react';
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
            { type: 'LOAD_CSV', title: 'Archivo CSV', description: 'Carga un archivo CSV desde tu dispositivo.', icon: <FileInput /> },
            { type: 'LOAD_EXCEL', title: 'Archivo Excel', description: 'Carga un archivo .xlsx o .xls y selecciona una hoja.', icon: <FileInput /> },
            { type: 'LOAD_JSON', title: 'Archivo JSON', description: 'Importa datos desde un archivo JSON.', icon: <FileInput /> },
            { type: 'LOAD_SUPABASE', title: 'Tabla de Supabase', description: 'Conéctate a una tabla o vista de Supabase.', icon: <Database /> },
            { type: 'LOAD_API', title: 'API Externa', description: 'Extrae datos desde un punto final de API REST.', icon: <UploadCloud /> },
        ]
    },
    {
        id: 'transform',
        title: 'Transformación',
        icon: '🟨',
        nodes: [
            { type: 'RENAME_COLUMNS', title: 'Renombrar Columnas', description: 'Cambia el nombre de una o más columnas.', icon: <Rows /> },
            { type: 'CONVERT_DATATYPE', title: 'Cambiar Tipo de Dato', description: 'Modifica el tipo de una columna (texto, número, fecha...).', icon: <Type /> },
            { type: 'MERGE_COLUMNS', title: 'Unir Columnas', description: 'Combina varias columnas en una sola.', icon: <GitMerge /> },
            { type: 'SPLIT_COLUMN', title: 'Dividir Columna', description: 'Divide una columna en varias según un delimitador.', icon: <Split /> },
            { type: 'CALCULATE_COLUMN', title: 'Calcular Columna', description: 'Crea una nueva columna aplicando fórmulas o expresiones.', icon: <Calculator /> },
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
