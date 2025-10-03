
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Area, AreaChart, Bar, BarChart, Line, LineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Cell } from 'recharts';
import { ArrowDown, ArrowUp, Info, MoreHorizontal } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const salesChartData = [
  { month: 'Jan', sales: 120000 },
  { month: 'Feb', sales: 280000 },
  { month: 'Mar', sales: 240000 },
  { month: 'Apr', sales: 80000 },
  { month: 'May', sales: 220000 },
  { month: 'Jun', sales: 250000 },
];

const visitorsChartData = [
    { month: 'Jan', new: 18000, returning: 1200 },
    { month: 'Feb', new: 22000, returning: 1500 },
    { month: 'Mar', new: 25000, returning: 1300 },
    { month: 'Apr', new: 19000, returning: 1600 },
    { month: 'May', new: 32000, returning: 1800 },
    { month: 'Jun', new: 36786, returning: 467 },
];

const trafficSourceData = [
    { source: 'Direct', value: 237, fill: 'var(--color-chart-3)' },
    { source: 'Social', value: 305, fill: 'var(--color-chart-2)' },
    { source: 'Google', value: 186, fill: 'var(--color-chart-1)' },
];

const customersData = [
    { month: 'Jan', customers: 4000 },
    { month: 'Feb', customers: 3000 },
    { month: 'Mar', customers: 5000 },
    { month: 'Apr', customers: 4500 },
    { month: 'May', customers: 6000 },
    { month: 'Jun', customers: 5500 },
]

const buyersData = [{ name: 'Buyers', value: 200, fill: 'hsl(var(--chart-2))' }];
const totalBuyers = 300;

export function AnalyticsView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      
      {/* Columna Izquierda */}
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Sales</CardTitle>
                <CardDescription>Visualize sales performance trends</CardDescription>
              </div>
              <Tabs defaultValue="month" className="w-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-end">
            <div className="space-y-4">
              <Card className="bg-muted/50 p-4">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-muted-foreground">Net Sales</p>
                    <Info className="w-4 h-4 text-muted-foreground"/>
                </div>
                <p className="text-2xl font-bold">$4.567.820</p>
                <p className="text-xs text-success flex items-center"><ArrowUp className="w-3 h-3 mr-1"/> 24,5% (+10)</p>
              </Card>
              <Card className="bg-muted/50 p-4">
                 <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-muted-foreground">Orders</p>
                    <Info className="w-4 h-4 text-muted-foreground"/>
                </div>
                <p className="text-2xl font-bold">1246</p>
                <p className="text-xs text-destructive flex items-center"><ArrowDown className="w-3 h-3 mr-1"/> 5,5% (-15)</p>
              </Card>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesChartData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} tickFormatter={(value) => `${Number(value)/1000}k`}/>
                  <Tooltip cursor={{fill: 'hsla(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                  <Bar dataKey="sales" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <div className="flex justify-between items-center">
              <div>
                <CardTitle>Traffic Source</CardTitle>
                <CardDescription>Gain insights into where your visitors are coming from.</CardDescription>
              </div>
              <Tabs defaultValue="month" className="w-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficSourceData} layout="vertical" margin={{ left: 10 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="source" type="category" tickLine={false} axisLine={false} width={80} fontSize={14} />
                    <Tooltip cursor={{fill: 'hsla(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                    <Bar dataKey="value" barSize={30} radius={[0, 4, 4, 0]}>
                        {trafficSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Columna Derecha */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Visitors</CardTitle>
                <CardDescription>Key visitor information at a glance</CardDescription>
              </div>
              <Tabs defaultValue="month" className="w-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-end">
            <div className="space-y-4">
              <Card className="bg-muted/50 p-4">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-muted-foreground">New Visitors</p>
                    <Info className="w-4 h-4 text-muted-foreground"/>
                </div>
                <p className="text-2xl font-bold">36.786</p>
                <p className="text-xs text-success flex items-center"><ArrowUp className="w-3 h-3 mr-1"/> 66,7% (+10)</p>
              </Card>
              <Card className="bg-muted/50 p-4">
                 <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-muted-foreground">Returning</p>
                    <Info className="w-4 h-4 text-muted-foreground"/>
                </div>
                <p className="text-2xl font-bold">467</p>
                <p className="text-xs text-destructive flex items-center"><ArrowDown className="w-3 h-3 mr-1"/> 5,5% (-6)</p>
              </Card>
            </div>
            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={visitorsChartData}>
                         <defs>
                            <linearGradient id="fillNew" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="fillReturning" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                        <Tooltip cursor={{stroke: 'hsl(var(--border))', strokeDasharray: '4 4'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                        <Area type="monotone" dataKey="new" stroke="hsl(var(--chart-1))" fill="url(#fillNew)" stackId="1" />
                        <Area type="monotone" dataKey="returning" stroke="hsl(var(--chart-2))" fill="url(#fillReturning)" stackId="1" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Customers</CardTitle>
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground"/>
                    </div>
                    <CardDescription>Customer performance and growth trends.</CardDescription>
                </CardHeader>
                <CardContent className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={customersData}>
                            <defs>
                                <linearGradient id="fillCustomers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" hide/>
                            <YAxis hide domain={['dataMin - 1000', 'dataMax + 500']}/>
                            <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                            <Line type="monotone" dataKey="customers" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Buyers Profile</CardTitle>
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground"/>
                    </div>
                    <CardDescription>Discover key insights into the buyer's preferences</CardDescription>
                </CardHeader>
                <CardContent className="h-48 flex items-center justify-center">
                    <div className="relative h-40 w-40">
                         <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                <Pie 
                                    data={buyersData} 
                                    dataKey="value"
                                    startAngle={90} 
                                    endAngle={-270} 
                                    innerRadius="75%" 
                                    outerRadius="100%"
                                    cy="50%"
                                    strokeWidth={0}
                                />
                                <Pie 
                                    data={[{value: totalBuyers}]}
                                    dataKey="value"
                                    cy="50%"
                                    stroke="hsl(var(--muted))"
                                    fill="hsl(var(--muted))"
                                    innerRadius="75%" 
                                    outerRadius="100%"
                                    startAngle={90}
                                    endAngle={-270}
                                    isAnimationActive={false}
                                />
                            </RechartsPieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                           <p className="text-3xl font-bold">200</p>
                           <p className="text-sm text-muted-foreground">Buyers</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
