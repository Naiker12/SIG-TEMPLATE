import {
    LayoutDashboard,
    BarChart3,
    Settings,
    User,
    FileText,
    BrainCircuit,
    Webhook,
    FileUp,
    Merge,
    FileSearch,
    GitCompareArrows,
    Globe,
    CalendarClock,
    UploadCloud,
    ClipboardCheck,
    Table2,
    Minimize,
    FileSymlink,
    Replace,
    AreaChart,
    File,
    DatabaseZap,
} from "lucide-react";

export type AdminMenuItem = {
    icon: React.ElementType;
    label: string;
    href: string;
    isCollapsible?: boolean;
    submenu?: {
        icon: React.ElementType;
        label: string;
        href: string;
    }[];
};

export type SettingsMenuItem = {
    icon: React.ElementType;
    label: string;
    href: string;
    badge?: string;
};


export const adminMenuItems: AdminMenuItem[] = [
    { icon: LayoutDashboard, label: "Tablero", href: "/" },
    {
        icon: FileText,
        label: "Gestión PDF",
        href: "#",
        isCollapsible: true,
        submenu: [
            { icon: Minimize, label: "Optimizar Archivos", href: "/gestion-pdf/comprimir" },
            { icon: FileSymlink, label: "Convertir a PDF", href: "/gestion-pdf/convertir" },
            { icon: Merge, label: "Dividir / Unir PDF", href: "/gestion-pdf/dividir-unir" },
        ]
    },
    {
        icon: File,
        label: "Gestión de Word",
        href: "#",
        isCollapsible: true,
        submenu: [
            { icon: FileSymlink, label: "Convertir a PDF", href: "/gestion-word/convertir-a-pdf" },
        ]
    },
    {
        icon: BrainCircuit,
        label: "Buscar con IA",
        href: "/buscar-con-ia/busqueda-semantica",
    },
    {
        icon: BarChart3,
        label: "Visualización",
        href: "#",
        isCollapsible: true,
        submenu: [
            { icon: FileSearch, label: "Visor de Archivos", href: "/visualizacion/visor-de-archivos" },
            { icon: GitCompareArrows, label: "Vista Comparativa", href: "/visualizacion/vista-comparativa" },
        ]
    },
    {
        icon: FileUp,
        label: "Subir Excel",
        href: "#",
        isCollapsible: true,
        submenu: [
            { icon: UploadCloud, label: "Procesar Excel", href: "/subir-excel/procesar-excel" },
            { icon: ClipboardCheck, label: "Validación de Formato", href: "/subir-excel/validacion-de-formato" },
            { icon: Table2, label: "Conversión a Dataset", href: "/subir-excel/conversion-a-dataset" },
            { icon: DatabaseZap, label: "Excel a API", href: "/subir-excel/excel-a-api" },
        ]
    },
    {
        icon: AreaChart,
        label: "Análisis de Datos",
        href: "#",
        isCollapsible: true,
        submenu: [
             { icon: LayoutDashboard, label: "Dashboard de Análisis", href: "/analisis-de-datos/dashboard" },
            { icon: Replace, label: "Transformación", href: "/analisis-de-datos/transformacion" },
        ]
    },
    {
        icon: Webhook,
        label: "Extraer de APIs",
        href: "#",
        isCollapsible: true,
        submenu: [
            { icon: Globe, label: "API Personalizada", href: "/extraer-apis/api-personalizada" },
            { icon: CalendarClock, label: "Sincronización Programada", href: "/extraer-apis/sincronizacion-programada" },
        ]
    },
];

export const settingsMenuItems: SettingsMenuItem[] = [
    { icon: User, label: "Perfil", href: "/profile" },
    { icon: Settings, label: "Configuración", href: "/settings" },
];
