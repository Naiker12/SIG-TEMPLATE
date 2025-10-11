
import { Database, FileInput, UploadCloud, Type, Filter, Trash2, Rows, Calculator, Sigma, BarChart, LineChart, PieChart, FileOutput, Download, Workflow, Split, GitMerge, FileX2, FilterX, Eraser, Columns, SortAsc, CaseSensitive, CheckSquare, TrendingUp, Sparkles, SlidersHorizontal, Table2, Grid, ScatterChart, Rows3 } from 'lucide-react';
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
            { type: 'REMOVE_DUPLICATES', title: 'Eliminar Duplicados', description: 'Quita filas que son idénticas en columnas clave.', icon: <Trash2 /> },
            { type: 'REMOVE_NULLS', title: 'Eliminar Nulos', description: 'Elimina filas o columnas que contengan valores vacíos.', icon: <FileX2 /> },
            { type: 'FILL_NULLS', title: 'Rellenar Nulos', description: 'Rellena valores nulos con una estrategia definida (media, valor fijo, etc.).', icon: <Eraser /> },
            { type: 'FILTER_ROWS', title: 'Filtrar Filas', description: 'Elimina filas basadas en una o más condiciones lógicas.', icon: <Filter /> },
            { type: 'SELECT_COLUMNS', title: 'Seleccionar Columnas', description: 'Mantiene únicamente las columnas relevantes del dataset.', icon: <Columns /> },
            { type: 'SORT_DATA', title: 'Ordenar Datos', description: 'Ordena el dataset por una o más columnas.', icon: <SortAsc /> },
            { type: 'NORMALIZE_TEXT', title: 'Normalizar Texto', description: 'Limpia y estandariza columnas de texto (minúsculas, sin acentos...).', icon: <CaseSensitive /> },
            { type: 'VALIDATE_SCHEMA', title: 'Validar Esquema', description: 'Comprueba que los datos cumplan con un formato y tipo definidos.', icon: <CheckSquare /> },
        ]
    },
    {
        id: 'analyze',
        title: 'Análisis y Cálculos',
        icon: '🟧',
        nodes: [
            { type: 'AGGREGATE_STATS', title: 'Agrupar y Resumir', description: 'Agrupa datos por categoría y calcula estadísticas (suma, promedio...).', icon: <Sigma /> },
            { type: 'SUMMARIZE_DATA', title: 'Resumen Estadístico', description: 'Calcula estadísticas descriptivas generales del dataset.', icon: <SlidersHorizontal /> },
            { type: 'CALCULATE_METRIC', title: 'Calcular Métrica', description: 'Crea una nueva columna con métricas personalizadas (KPIs).', icon: <Calculator /> },
            { type: 'DATE_EXTRACT', title: 'Extraer de Fecha', description: 'Extrae componentes de una fecha (año, mes, día, trimestre...).', icon: <Split /> },
            { type: 'RANK_VALUES', title: 'Ranking de Valores', description: 'Asigna un ranking a los valores basado en una métrica.', icon: <TrendingUp /> },
            { type: 'CORRELATION_MATRIX', title: 'Matriz de Correlación', description: 'Calcula la correlación entre variables numéricas.', icon: <Sparkles /> },
            { type: 'DETECT_OUTLIERS', title: 'Detectar Outliers', description: 'Detecta valores atípicos usando métodos estadísticos.', icon: <FilterX /> },
        ]
    },
    {
        id: 'visualize',
        title: 'Visualización',
        icon: '🟪',
        nodes: [
            { type: 'BAR_CHART', title: 'Gráfico de Barras', description: 'Compara valores entre diferentes categorías.', icon: <BarChart /> },
            { type: 'LINE_CHART', title: 'Gráfico de Líneas', description: 'Muestra tendencias a lo largo de un período de tiempo.', icon: <LineChart /> },
            { type: 'PIE_CHART', title: 'Gráfico de Pastel', description: 'Muestra la proporción de cada categoría sobre un total.', icon: <PieChart /> },
            { type: 'SCATTER_PLOT', title: 'Gráfico de Dispersión', description: 'Visualiza la relación entre dos variables numéricas.', icon: <ScatterChart /> },
            { type: 'HEATMAP', title: 'Mapa de Calor', description: 'Representa la magnitud de un fenómeno en colores.', icon: <Grid /> },
            { type: 'TABLE_VIEW', title: 'Vista de Tabla', description: 'Muestra los datos en una tabla interactiva.', icon: <Table2 /> },
            { type: 'SUMMARY_CARD', title: 'Tarjeta de Resumen (KPI)', description: 'Muestra un indicador clave de rendimiento.', icon: <Calculator /> },
            { type: 'DATA_LIMITER', title: 'Limitador de Datos', description: 'Controla el número de filas que pasan a la visualización.', icon: <Rows3 /> },
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
