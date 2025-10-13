import {
    LayoutDashboard,
    BarChart3,
    Settings,
    User,
    FileText,
    BrainCircuit,
    Webhook,
    FileUp,
    AreaChart,
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

export const platformItems: MenuItem[] = [
    {
        title: "Tablero",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Buscar con IA",
        href: "/buscar-con-ia/busqueda-semantica",
        icon: BrainCircuit,
    },
    {
        title: "Análisis de Datos",
        href: "/analisis-de-datos/dashboard",
        icon: AreaChart,
        isCollapsible: true,
        items: [
            { title: "Dashboard", href: "/analisis-de-datos/dashboard" },
            { title: "Transformación", href: "/analisis-de-datos/transformacion" },
        ]
    },
];

export const toolsItems: MenuItem[] = [
    {
        title: "Extraer APIs",
        href: "/extraer-apis/api-personalizada",
        icon: Webhook,
        isCollapsible: true,
        items: [
            { title: "API Personalizada", href: "/extraer-apis/api-personalizada" },
            { title: "Sincronización", href: "/extraer-apis/sincronizacion-programada" },
        ]
    },
    {
        title: "Gestión PDF",
        href: "/gestion-pdf/comprimir",
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
        href: "/gestion-word/convertir-a-pdf",
        icon: FileSignature,
        isCollapsible: true,
        items: [
            { title: "Convertir a PDF", href: "/gestion-word/convertir-a-pdf" },
        ]
    },
    {
        title: "Gestión Excel",
        href: "/subir-excel/procesar-excel",
        icon: FileUp,
        isCollapsible: true,
        items: [
            { title: "Procesar", href: "/subir-excel/procesar-excel" },
            { title: "Validación de Formato", href: "/subir-excel/validacion-de-formato" },
            { title: "Conversión a Dataset", href: "/subir-excel/conversion-a-dataset" },
            { title: "Excel a API", href: "/subir-excel/excel-a-api" },
        ]
    },
    {
        title: "Visualización",
        href: "/visualizacion/visor-de-archivos",
        icon: BarChart3,
        items: [
            { title: "Visor de Archivos", href: "/visualizacion/visor-de-archivos" },
        ]
    },
];

// New array for public tools
export const publicToolsItems: MenuItem[] = toolsItems.filter(item => 
    item.title === "Gestión PDF" || item.title === "Gestión Word"
);

export const userMenuItems: MenuItem[] = [
    { title: "Perfil", href: "/profile", icon: User },
    { title: "Configuración", href: "/settings", icon: Settings },
];
