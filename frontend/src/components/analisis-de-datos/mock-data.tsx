
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";

export const availableColumns = [
    'month', 'categoria', 'pais', 'ingresos', 'costos', 'unidades_vendidas', 'fuente_trafico'
];

export const categoricalColumns = ['month', 'categoria', 'pais', 'fuente_trafico'];
export const numericalColumns = ['ingresos', 'costos', 'unidades_vendidas'];

export const mockData = [
    { month: 'Ene', categoria: 'Electrónica', pais: 'Colombia', ingresos: 4500, costos: 2800, unidades_vendidas: 120, fuente_trafico: 'Web' },
    { month: 'Feb', categoria: 'Electrónica', pais: 'Colombia', ingresos: 5200, costos: 3100, unidades_vendidas: 150, fuente_trafico: 'Web' },
    { month: 'Mar', categoria: 'Ropa', pais: 'México', ingresos: 4100, costos: 2000, unidades_vendidas: 350, fuente_trafico: 'TikTok' },
    { month: 'Abr', categoria: 'Hogar', pais: 'Colombia', ingresos: 3100, costos: 1500, unidades_vendidas: 200, fuente_trafico: 'Pinterest' },
    { month: 'May', categoria: 'Electrónica', pais: 'México', ingresos: 7500, costos: 4500, unidades_vendidas: 210, fuente_trafico: 'Web' },
    { month: 'Jun', categoria: 'Hogar', pais: 'México', ingresos: 3900, costos: 1900, unidades_vendidas: 250, fuente_trafico: 'Pinterest' },
];

export const mockKpis = [
  {
    title: 'Ingresos Totales',
    value: '$45,231.89',
    change: '+20.1%',
    isPositive: true,
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    title: 'Nuevos Clientes',
    value: '+2350',
    change: '+180.1%',
    isPositive: true,
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: 'Ventas',
    value: '+12,234',
    change: '+19%',
    isPositive: true,
    icon: <ShoppingCart className="h-4 w-4" />,
  },
  {
    title: 'Tasa de Éxito',
    value: '98.2%',
    change: '-1.2%',
    isPositive: false,
    icon: <TrendingUp className="h-4 w-4" />,
  },
];

export const mockSalesOverTime = [
    { month: 'Ene', sales: 4500 },
    { month: 'Feb', sales: 5200 },
    { month: 'Mar', sales: 4100 },
    { month: 'Abr', sales: 3100 },
    { month: 'May', sales: 7500 },
    { month: 'Jun', sales: 3900 },
];

export const mockSalesByCategory = [
    { name: 'Electrónica', sales: 17200, fill: 'var(--color-electronics)' },
    { name: 'Ropa', sales: 4100, fill: 'var(--color-clothing)' },
    { name: 'Hogar', sales: 7000, fill: 'var(--color-home)' },
];


export const toolUsageData = [
  { name: 'PDF', usage: 237 },
  { name: 'Word', usage: 305 },
  { name: 'Excel', usage: 186 },
];

export const dailyTasksData = [
    { day: 'Lun', tasks: 40 },
    { day: 'Mar', tasks: 30 },
    { day: 'Mié', tasks: 20 },
    { day: 'Jue', tasks: 27 },
    { day: 'Vie', tasks: 18 },
    { day: 'Sáb', tasks: 23 },
    { day: 'Dom', tasks: 34 },
];

export const successRateData = [
    { name: 'success', value: 92 },
    { name: 'remaining', value: 8 }
];

    