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
    isActive?: boolean; // This might be calculated dynamically
    items?: SubMenuItem[];
    variant: "default" | "ghost";
};


export const menuItems: MenuItem[] = [
    {
        title: "Tablero",
        href: "/",
        icon: LayoutDashboard,
        variant: "default",
    },
    {
        title: "Buscar con IA",
        href: "/buscar-con-ia/busqueda-semantica",
        icon: BrainCircuit,
        variant: "ghost",
    },
    {
        title: "Análisis de Datos",
        href: "/analisis-de-datos/dashboard",
        icon: AreaChart,
        variant: "ghost",
        isCollapsible: true,
        items: [
            { title: "Dashboard", href: "/analisis-de-datos/dashboard" },
            { title: "Transformación", href: "/analisis-de-datos/transformacion" },
        ]
    },
    {
        title: "Extraer de APIs",
        href: "/extraer-apis/api-personalizada",
        icon: Webhook,
        variant: "ghost",
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
        variant: "ghost",
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
        variant: "ghost",
        isCollapsible: true,
        items: [
            { title: "Convertir a PDF", href: "/gestion-word/convertir-a-pdf" },
        ]
    },
    {
        title: "Visualización",
        href: "/visualizacion/visor-de-archivos",
        icon: BarChart3,
        variant: "ghost",
        isCollapsible: true,
        items: [
            { title: "Visor de Archivos", href: "/visualizacion/visor-de-archivos" },
            { title: "Vista Comparativa", href: "/visualizacion/vista-comparativa" },
        ]
    },
    {
        title: "Gestión Excel",
        href: "/subir-excel/procesar-excel",
        icon: FileUp,
        variant: "ghost",
        isCollapsible: true,
        items: [
            { title: "Procesar", href: "/subir-excel/procesar-excel" },
            { title: "Validación", href: "/subir-excel/validacion-de-formato" },
            { title: "A Dataset", href: "/subir-excel/conversion-a-dataset" },
            { title: "A API", href: "/subir-excel/excel-a-api" },
        ]
    },
];

export const settingsMenuItems: MenuItem[] = [
    { title: "Perfil", href: "/profile", icon: User, variant: "ghost" },
    { title: "Configuración", href: "/settings", icon: Settings, variant: "ghost" },
];
