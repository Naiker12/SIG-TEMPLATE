
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Area, AreaChart, Bar, BarChart, Line, LineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Cell } from 'recharts';
import { ArrowDown, ArrowUp, Info, MoreHorizontal, TrendingUp, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const toolUsageData = [
  { month: 'Ene', usage: 120 },
  { month: 'Feb', usage: 280 },
  { month: 'Mar', usage: 240 },
  { month: 'Abr', usage: 80 },
  { month: 'May', usage: 220 },
  { month: 'Jun', usage: 250 },
];

const userActivityData = [
    { month: 'Ene', active: 180, sessions: 1200 },
    { month: 'Feb', active: 220, sessions: 1500 },
    { month: 'Mar', active: 250, sessions: 1300 },
    { month: 'Abr', active: 190, sessions: 1600 },
    { month: 'May', active: 320, sessions: 1800 },
    { month: 'Jun', active: 367, sessions: 4670 },
];

const fileTypeData = [
    { source: 'PDF', value: 237, fill: 'hsl(var(--chart-3))' },
    { source: 'Word', value: 305, fill: 'hsl(var(--chart-2))' },
    { source: 'Excel', value: 186, fill: 'hsl(var(--chart-1))' },
];

const dailyTasksData = [
    { day: 'Lun', tasks: 40 },
    { day: 'Mar', tasks: 30 },
    { day: 'Mié', tasks: 20 },
    { day: 'Jue', tasks: 27 },
    { day: 'Vie', tasks: 18 },
    { day: 'Sáb', tasks: 23 },
    { day: 'Dom', tasks: 34 },
]

const successRateData = [
    { name: 'success', value: 92, fill: 'hsl(var(--chart-2))' },
    { name: 'remaining', value: 8, fill: 'hsl(var(--muted))' }
]

export function AnalyticsView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      
      {/* Columna Izquierda */}
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Uso de Herramientas</CardTitle>
                <CardDescription>Visualiza las tendencias de uso de las herramientas.</CardDescription>
              </div>
              <Tabs defaultValue="month" className="w-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="month">Mes</TabsTrigger>
                  <TabsTrigger value="week">Semana</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-end">
            <div className="space-y-4">
              <Card className="bg-muted/50 p-4">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-muted-foreground">Procesamientos Totales</p>
                    <Info className="w-4 h-4 text-muted-foreground"/>
                </div>
                <p className="text-2xl font-bold">4,567</p>
                <p className="text-xs text-success flex items-center"><ArrowUp className="w-3 h-3 mr-1"/> 24,5%</p>
              </Card>
              <Card className="bg-muted/50 p-4">
                 <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-muted-foreground">Archivos Únicos</p>
                    <Info className="w-4 h-4 text-muted-foreground"/>
                </div>
                <p className="text-2xl font-bold">1,246</p>
                <p className="text-xs text-destructive flex items-center"><ArrowDown className="w-3 h-3 mr-1"/> 5,5%</p>
              </Card>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={toolUsageData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} tickFormatter={(value) => `${Number(value)}`}/>
                  <Tooltip cursor={{fill: 'hsla(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                  <Bar dataKey="usage" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Columna Derecha */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Actividad de Usuarios</CardTitle>
                <CardDescription>Información clave de la actividad.</CardDescription>
              </div>
              <Tabs defaultValue="month" className="w-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="month">Mes</TabsTrigger>
                  <TabsTrigger value="week">Semana</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-end">
            <div className="space-y-4">
              <Card className="bg-muted/50 p-4">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                    <Info className="w-4 h-4 text-muted-foreground"/>
                </div>
                <p className="text-2xl font-bold">367</p>
                <p className="text-xs text-success flex items-center"><ArrowUp className="w-3 h-3 mr-1"/> 12.7%</p>
              </Card>
              <Card className="bg-muted/50 p-4">
                 <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-muted-foreground">Sesiones Totales</p>
                    <Info className="w-4 h-4 text-muted-foreground"/>
                </div>
                <p className="text-2xl font-bold">4,670</p>
                <p className="text-xs text-destructive flex items-center"><ArrowDown className="w-3 h-3 mr-1"/> 2.1%</p>
              </Card>
            </div>
            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={userActivityData}>
                         <defs>
                            <linearGradient id="fillActive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="fillSessions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                        <Tooltip cursor={{stroke: 'hsl(var(--border))', strokeDasharray: '4 4'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                        <Area type="monotone" dataKey="active" name="Activos" stroke="hsl(var(--chart-1))" fill="url(#fillActive)" stackId="1" />
                        <Area type="monotone" dataKey="sessions" name="Sesiones" stroke="hsl(var(--chart-2))" fill="url(#fillSessions)" stackId="1" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

       {/* Fila Inferior */}
        <div className="lg:col-span-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Tipos de Archivo Procesados</CardTitle>
                            <CardDescription>Qué formatos son los más comunes.</CardDescription>
                        </div>
                        <Tabs defaultValue="month" className="w-auto">
                            <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="month">Mes</TabsTrigger>
                            <TabsTrigger value="week">Semana</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        </div>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={fileTypeData} layout="vertical" margin={{ left: 10 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="source" type="category" tickLine={false} axisLine={false} width={80} fontSize={14} />
                                <Tooltip cursor={{fill: 'hsla(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                                <Bar dataKey="value" barSize={30} radius={[0, 4, 4, 0]}>
                                    {fileTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Tareas por Día</CardTitle>
                             <MoreHorizontal className="w-4 h-4 text-muted-foreground"/>
                        </div>
                        <CardDescription>Volumen de tareas en la última semana.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-48">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyTasksData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="fillTasks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" hide/>
                                <YAxis hide domain={['dataMin - 10', 'dataMax + 5']}/>
                                <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                                <Area type="monotone" dataKey="tasks" stroke="hsl(var(--chart-1))" fill="url(#fillTasks)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                     <CardFooter className="flex justify-center text-sm text-muted-foreground">
                        <TrendingUp className="w-4 h-4 mr-1"/>
                        Creciendo un 5.2% esta semana
                    </CardFooter>
                </Card>
                <Card>
                     <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Tasa de Éxito</CardTitle>
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground"/>
                        </div>
                        <CardDescription>Procesos completados vs. errores.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-48 flex items-center justify-center">
                        <div className="relative h-40 w-40">
                             <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                    <Pie 
                                        data={successRateData} 
                                        dataKey="value"
                                        startAngle={90} 
                                        endAngle={-270} 
                                        innerRadius="75%" 
                                        outerRadius="100%"
                                        cy="50%"
                                        strokeWidth={0}
                                        isAnimationActive={false}
                                    >
                                        <Cell key="success" fill="hsl(var(--chart-2))" />
                                        <Cell key="remaining" fill="hsl(var(--muted))" />
                                    </Pie>
                                </RechartsPieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <p className="text-3xl font-bold">92%</p>
                                <p className="text-sm text-muted-foreground">Éxito</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center gap-4 text-sm text-muted-foreground">
                        <div className='flex items-center text-green-500'><CheckCircle className="w-4 h-4 mr-1"/> Completados: 1,226</div>
                        <div className='flex items-center text-red-500'><AlertCircle className="w-4 h-4 mr-1"/> Errores: 28</div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>
  );
}
