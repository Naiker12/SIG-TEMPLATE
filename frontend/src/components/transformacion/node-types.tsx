
import React from 'react';
import { Database, FileInput, UploadCloud, Type, Filter, Trash2, Rows, Calculator, Sigma, BarChart, LineChart, PieChart, FileOutput, Download, Workflow, Split, GitMerge, FileX2, FilterX, Eraser, Columns, SortAsc, CaseSensitive, CheckSquare, TrendingUp, Sparkles, SlidersHorizontal, Table2, Grid, ScatterChart, Rows3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Import Node Components
import { LoadCsvNode } from './nodes/input/LoadCsvNode';
// Add other node component imports here as you create them

export type NodeDefinition = {
    type: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    component: React.FC<any>; // Each node will have its own component
    category: 'input' | 'transform' | 'clean' | 'analyze' | 'visualize' | 'output' | 'control';
};

export type NodeCategory = {
    id: 'input' | 'transform' | 'clean' | 'analyze' | 'visualize' | 'output' | 'control';
    title: string;
    icon: string; // Emoji
    nodes: NodeDefinition[];
};

export const NODE_CATEGORIES: NodeCategory[] = [
    {
        id: 'input',
        title: 'Cargar Datos',
        icon: '📥',
        nodes: [
            { type: 'LOAD_CSV', title: 'Archivo CSV', description: 'Carga un archivo CSV desde tu dispositivo.', icon: <FileInput />, component: LoadCsvNode, category: 'input' },
            { type: 'LOAD_EXCEL', title: 'Archivo Excel', description: 'Carga un .xlsx o .xls y selecciona una hoja.', icon: <FileInput />, component: LoadCsvNode, category: 'input' },
            { type: 'LOAD_JSON', title: 'Archivo JSON', description: 'Importa datos desde un archivo JSON.', icon: <FileInput />, component: LoadCsvNode, category: 'input' },
            { type: 'LOAD_SUPABASE', title: 'Tabla de Supabase', description: 'Conéctate a una tabla o vista de Supabase.', icon: <Database />, component: LoadCsvNode, category: 'input' },
            { type: 'LOAD_API', title: 'API Externa', description: 'Extrae datos desde un punto final de API REST.', icon: <UploadCloud />, component: LoadCsvNode, category: 'input' },
        ]
    },
    {
        id: 'transform',
        title: 'Transformación',
        icon: '✨',
        nodes: [
            { type: 'RENAME_COLUMNS', title: 'Renombrar Columnas', description: 'Cambia el nombre de una o más columnas.', icon: <Rows />, component: LoadCsvNode, category: 'transform' },
            { type: 'CONVERT_DATATYPE', title: 'Cambiar Tipo de Dato', description: 'Modifica el tipo de una columna (texto, número, fecha...).', icon: <Type />, component: LoadCsvNode, category: 'transform' },
            { type: 'MERGE_COLUMNS', title: 'Unir Columnas', description: 'Combina varias columnas en una sola.', icon: <GitMerge />, component: LoadCsvNode, category: 'transform' },
            { type: 'SPLIT_COLUMN', title: 'Dividir Columna', description: 'Divide una columna en varias partes según un delimitador.', icon: <Split />, component: LoadCsvNode, category: 'transform' },
            { type: 'CALCULATE_COLUMN', title: 'Calcular Columna', description: 'Crea una nueva columna aplicando fórmulas o expresiones.', icon: <Calculator />, component: LoadCsvNode, category: 'transform' },
        ]
    },
    {
        id: 'clean',
        title: 'Limpieza y Filtrado',
        icon: '🧼',
        nodes: [
            { type: 'REMOVE_DUPLICATES', title: 'Eliminar Duplicados', description: 'Quita filas que son idénticas en columnas clave.', icon: <Trash2 />, component: LoadCsvNode, category: 'clean' },
            { type: 'REMOVE_NULLS', title: 'Eliminar Nulos', description: 'Elimina filas/columnas con valores vacíos.', icon: <FileX2 />, component: LoadCsvNode, category: 'clean' },
            { type: 'FILL_NULLS', title: 'Rellenar Nulos', description: 'Rellena valores nulos con una estrategia definida.', icon: <Eraser />, component: LoadCsvNode, category: 'clean' },
            { type: 'FILTER_ROWS', title: 'Filtrar Filas', description: 'Elimina filas basadas en una o más condiciones lógicas.', icon: <Filter />, component: LoadCsvNode, category: 'clean' },
            { type: 'SELECT_COLUMNS', title: 'Seleccionar Columnas', description: 'Mantiene únicamente las columnas relevantes.', icon: <Columns />, component: LoadCsvNode, category: 'clean' },
        ]
    },
     {
        id: 'visualize',
        title: 'Visualización',
        icon: '📊',
        nodes: [
            { type: 'BAR_CHART', title: 'Gráfico de Barras', description: 'Compara valores entre diferentes categorías.', icon: <BarChart />, component: LoadCsvNode, category: 'visualize' },
            { type: 'LINE_CHART', title: 'Gráfico de Líneas', description: 'Muestra tendencias a lo largo de un período de tiempo.', icon: <LineChart />, component: LoadCsvNode, category: 'visualize' },
            { type: 'PIE_CHART', title: 'Gráfico de Pastel', description: 'Muestra la proporción de cada categoría sobre un total.', icon: <PieChart />, component: LoadCsvNode, category: 'visualize' },
        ]
    },
    {
        id: 'output',
        title: 'Exportación y Salida',
        icon: '📤',
        nodes: [
             { type: 'EXPORT_FILE', title: 'Exportar a Archivo', description: 'Guarda el resultado como CSV o Excel.', icon: <FileOutput />, component: LoadCsvNode, category: 'output' },
             { type: 'DOWNLOAD_RESULT', title: 'Descargar Resultado', description: 'Descarga los datos directamente en tu navegador.', icon: <Download />, component: LoadCsvNode, category: 'output' },
        ]
    },
];
