
import React from 'react';
import { Database, FileInput, UploadCloud, Type, Filter, Trash2, Rows, Calculator, BarChart, LineChart, PieChart, FileOutput, Download, Split, GitMerge } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Import Node Components
import { BaseNode } from './nodes/BaseNode';

export type NodeDefinition = {
    type: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    component: React.FC<any>;
    category: 'input' | 'transform' | 'visualize' | 'output';
};

export type NodeCategory = {
    id: 'input' | 'transform' | 'visualize' | 'output';
    title: string;
    icon: string; // Emoji
    nodes: NodeDefinition[];
};

// A flat map for easier lookup
export const NODE_DEFINITIONS: Record<string, NodeDefinition> = {
    LOAD_CSV: { type: 'LOAD_CSV', title: 'Archivo CSV', description: 'Carga datos desde un archivo .csv.', icon: <FileInput />, component: BaseNode, category: 'input' },
    LOAD_EXCEL: { type: 'LOAD_EXCEL', title: 'Archivo Excel', description: 'Carga desde un archivo .xlsx o .xls.', icon: <FileInput />, component: BaseNode, category: 'input' },
    LOAD_API: { type: 'LOAD_API', title: 'API Externa', description: 'Extrae datos desde un endpoint de API.', icon: <UploadCloud />, component: BaseNode, category: 'input' },

    RENAME_COLUMNS: { type: 'RENAME_COLUMNS', title: 'Renombrar Columnas', description: 'Cambia el nombre de una o más columnas.', icon: <Rows />, component: BaseNode, category: 'transform' },
    FILTER_ROWS: { type: 'FILTER_ROWS', title: 'Filtrar Filas', description: 'Elimina filas basadas en condiciones.', icon: <Filter />, component: BaseNode, category: 'transform' },
    
    BAR_CHART: { type: 'BAR_CHART', title: 'Gráfico de Barras', description: 'Compara valores entre categorías.', icon: <BarChart />, component: BaseNode, category: 'visualize' },
    LINE_CHART: { type: 'LINE_CHART', title: 'Gráfico de Líneas', description: 'Muestra tendencias a lo largo del tiempo.', icon: <LineChart />, component: BaseNode, category: 'visualize' },
    PIE_CHART: { type: 'PIE_CHART', title: 'Gráfico de Pastel', description: 'Muestra la proporción de cada categoría.', icon: <PieChart />, component: BaseNode, category: 'visualize' },

    EXPORT_FILE: { type: 'EXPORT_FILE', title: 'Exportar a Archivo', description: 'Guarda el resultado como CSV o Excel.', icon: <FileOutput />, component: BaseNode, category: 'output' },
    DOWNLOAD_RESULT: { type: 'DOWNLOAD_RESULT', title: 'Descargar Resultado', description: 'Descarga los datos en tu navegador.', icon: <Download />, component: BaseNode, category: 'output' },
};


export const NODE_CATEGORIES: NodeCategory[] = [
    {
        id: 'input',
        title: 'Cargar Datos',
        icon: '📥',
        nodes: [NODE_DEFINITIONS.LOAD_CSV, NODE_DEFINITIONS.LOAD_EXCEL, NODE_DEFINITIONS.LOAD_API]
    },
    {
        id: 'transform',
        title: 'Transformación',
        icon: '✨',
        nodes: [NODE_DEFINITIONS.RENAME_COLUMNS, NODE_DEFINITIONS.FILTER_ROWS]
    },
    {
        id: 'visualize',
        title: 'Visualización',
        icon: '📊',
        nodes: [NODE_DEFINITIONS.BAR_CHART, NODE_DEFINITIONS.LINE_CHART, NODE_DEFINITIONS.PIE_CHART]
    },
    {
        id: 'output',
        title: 'Exportación',
        icon: '📤',
        nodes: [NODE_DEFINITIONS.EXPORT_FILE, NODE_DEFINITIONS.DOWNLOAD_RESULT]
    },
];
