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
    DatabaseZap,
    FileSignature,
    FilePen,
    ChevronRight,
} from "lucide-react";

export type SubMenuItem = {
    title: string;
    href: string;
    icon?: React.ElementType;
};

export type MenuItem = {
    title: string;
    href: string;
    icon: React.ElementType;
    isCollapsible?: boolean;
    isActive?: boolean; // To track active state
    items?: SubMenuItem[];
};


export const publicMenuItems: MenuItem[] = [
    {
        title: "Gestión PDF",
        href: "#",
        icon: FileText,
        isCollapsible: true,
        items: [
            { title: "Optimizar Archivos", href: "/gestion-pdf/comprimir", icon: Minimize },
            { title: "Convertir a Word", href: "/gestion-pdf/convertir", icon: FilePen },
            { title: "Dividir / Unir PDF", href: "/gestion-pdf/dividir-unir", icon: Merge },
        ]
    },
    {
        title: "Gestión de Word",
        href: "#",
        icon: FileSignature,
        isCollapsible: true,
        items: [
            { title: "Convertir a PDF", href: "/gestion-word/convertir-a-pdf", icon: FileSymlink },
        ]
    },
    {
        title: "Visualización",
        href: "#",
        icon: BarChart3,
        isCollapsible: true,
        items: [
            { title: "Visor de Archivos", href: "/visualizacion/visor-de-archivos", icon: FileSearch },
            { title: "Vista Comparativa", href: "/visualizacion/vista-comparativa", icon: GitCompareArrows },
        ]
    },
    {
        title: "Subir Excel",
        href: "#",
        icon: FileUp,
        isCollapsible: true,
        items: [
            { title: "Procesar Excel", href: "/subir-excel/procesar-excel", icon: UploadCloud },
            { title: "Validación de Formato", href: "/subir-excel/validacion-de-formato", icon: ClipboardCheck },
            { title: "Conversión a Dataset", href: "/subir-excel/conversion-a-dataset", icon: Table2 },
            { title: "Excel a API", href: "/subir-excel/excel-a-api", icon: DatabaseZap },
        ]
    },
];

export const privateMenuItems: MenuItem[] = [
    { title: "Tablero", href: "/", icon: LayoutDashboard },
    {
        title: "Buscar con IA",
        href: "/buscar-con-ia/busqueda-semantica",
        icon: BrainCircuit,
    },
    {
        title: "Análisis de Datos",
        href: "#",
        icon: AreaChart,
        isCollapsible: true,
        items: [
             { title: "Dashboard de Análisis", href: "/analisis-de-datos/dashboard", icon: LayoutDashboard },
            { title: "Transformación", href: "/analisis-de-datos/transformacion", icon: Replace },
        ]
    },
    {
        title: "Extraer de APIs",
        href: "#",
        icon: Webhook,
        isCollapsible: true,
        items: [
            { title: "API Personalizada", href: "/extraer-apis/api-personalizada", icon: Globe },
            { title: "Sincronización Programada", href: "/extraer-apis/sincronizacion-programada", icon: CalendarClock },
        ]
    },
];

export const settingsMenuItems: SubMenuItem[] = [
    { title: "Perfil", href: "/profile", icon: User },
    { title: "Configuración", href: "/settings", icon: Settings },
];
