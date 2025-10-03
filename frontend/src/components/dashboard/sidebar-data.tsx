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
    isActive?: boolean;
    items?: SubMenuItem[];
};

export type MenuGroup = {
    label: string;
    items: MenuItem[];
};

export const platformMenu: MenuGroup = {
    label: "Plataforma",
    items: [
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
                 { title: "Dashboard", href: "/analisis-de-datos/dashboard" },
                { title: "Transformación", href: "/analisis-de-datos/transformacion" },
            ]
        },
        {
            title: "Extraer de APIs",
            href: "#",
            icon: Webhook,
            isCollapsible: true,
            items: [
                { title: "API Personalizada", href: "/extraer-apis/api-personalizada" },
                { title: "Sincronización", href: "/extraer-apis/sincronizacion-programada" },
            ]
        },
    ]
};

export const toolsMenu: MenuGroup = {
    label: "Herramientas",
    items: [
        {
            title: "Gestión PDF",
            href: "#",
            icon: FileText,
            isCollapsible: true,
            items: [
                { title: "Optimizar", href: "/gestion-pdf/comprimir" },
                { title: "Convertir a Word", href: "/gestion-pdf/convertir" },
                { title: "Dividir / Unir", href: "/gestion-pdf/dividir-unir" },
            ]
        },
        {
            title: "Gestión Word",
            href: "#",
            icon: FileSignature,
            isCollapsible: true,
            items: [
                { title: "Convertir a PDF", href: "/gestion-word/convertir-a-pdf" },
            ]
        },
        {
            title: "Visualización",
            href: "#",
            icon: BarChart3,
            isCollapsible: true,
            items: [
                { title: "Visor de Archivos", href: "/visualizacion/visor-de-archivos" },
                { title: "Vista Comparativa", href: "/visualizacion/vista-comparativa" },
            ]
        },
        {
            title: "Gestión Excel",
            href: "#",
            icon: FileUp,
            isCollapsible: true,
            items: [
                { title: "Procesar", href: "/subir-excel/procesar-excel" },
                { title: "Validación", href: "/subir-excel/validacion-de-formato" },
                { title: "A Dataset", href: "/subir-excel/conversion-a-dataset" },
                { title: "A API", href: "/subir-excel/excel-a-api" },
            ]
        },
    ]
};


export const settingsMenuItems: SubMenuItem[] = [
    { title: "Perfil", href: "/profile", icon: User },
    { title: "Configuración", href: "/settings", icon: Settings },
];
