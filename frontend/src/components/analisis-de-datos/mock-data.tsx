
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";

export const mockData = [
    { month: 'Enero', category: 'Electrónica', country: 'Colombia', sales: 4500, source: 'Web' },
    { month: 'Febrero', category: 'Electrónica', country: 'Colombia', sales: 5200, source: 'Web' },
    { month: 'Marzo', category: 'Ropa', country: 'México', sales: 4100, source: 'TikTok' },
    { month: 'Abril', category: 'Hogar', country: 'Colombia', sales: 3100, source: 'Pinterest' },
    { month: 'Mayo', category: 'Electrónica', country: 'México', sales: 7500, source: 'Web' },
    { month: 'Junio', category: 'Hogar', country: 'México', sales: 3900, source: 'Pinterest' },
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
