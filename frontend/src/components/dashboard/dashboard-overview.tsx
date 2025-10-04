
import { DollarSign, ShoppingBag, Users, BarChart } from 'lucide-react';
import { MetricCard } from './metric-card';
import { SaleActivityChart } from './sale-activity-chart';
import { RevenueChart } from './revenue-chart';
import { SubscriptionsChart } from './subscriptions-chart';
import { RecentFilesTable } from './recent-files-table';
import { type File as RecentFile } from '@/services/fileService';

const metricCardData = [
  {
    title: 'Nuevas Suscripciones',
    value: '4,682',
    change: '+15.54%',
    isPositive: true,
    icon: <Users />,
    chartData: [5, 6, 5, 9, 8, 7, 6],
  },
  {
    title: 'Nuevas Órdenes',
    value: '1,226',
    change: '-40.2%',
    isPositive: false,
    icon: <ShoppingBag />,
    chartData: [9, 8, 7, 6, 5, 4, 3],
  },
  {
    title: 'Ingreso Prom. por Orden',
    value: '1080',
    change: '+10.8%',
    isPositive: true,
    icon: <DollarSign />,
    chartData: [5, 6, 7, 8, 7, 6, 8],
  },
];

type DashboardOverviewProps = {
  files: RecentFile[];
};

export function DashboardOverview({ files }: DashboardOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {metricCardData.map((metric, index) => (
                      <MetricCard 
                          key={index}
                          title={metric.title}
                          value={metric.value}
                          change={metric.change}
                          isPositive={metric.isPositive}
                          icon={metric.icon}
                          chartData={metric.chartData}
                      />
                  ))}
              </div>
              <SaleActivityChart />
          </div>

          {/* Sidebar area */}
          <div className="lg:col-span-1 flex flex-col space-y-6">
              <RevenueChart />
              <SubscriptionsChart />
          </div>
      </div>
      <RecentFilesTable files={files} />
    </div>
  );
}
