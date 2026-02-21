import React, { useState } from 'react';
import Icon from '../../../components/ui/AppIconl';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

/* ================= TYPES ================= */

type TimeRange = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

interface SiteBreakdown {
  name: string;
  cost: number;
  workers: number;
}

interface MonthlyTrend {
  month: string;
  cost: number;
}

interface TopWorker {
  name: string;
  site: string;
  hours: number;
}

interface ChartData {
  totalCost: number;
  totalHours: number;
  avgDailyCost: number;
  activeWorkers: number;
  siteBreakdown: SiteBreakdown[];
  monthlyTrend: MonthlyTrend[];
  topWorkers: TopWorker[];
}

interface AnalyticsData {
  weekly?: ChartData;
  monthly?: ChartData;
  quarterly?: ChartData;
  yearly?: ChartData;
}

interface AnalyticsDashboardProps {
  analyticsData?: AnalyticsData;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

/* ================= COMPONENT ================= */

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  analyticsData,
  onExportPDF,
  onExportExcel
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [selectedSite, setSelectedSite] = useState<string>('all');

  const timeRangeOptions = [
    { value: 'weekly', label: 'Last 7 Days' },
    { value: 'monthly', label: 'Last 30 Days' },
    { value: 'quarterly', label: 'Last 3 Months' },
    { value: 'yearly', label: 'Last 12 Months' }
  ];

  const siteOptions = [
    { value: 'all', label: 'All Sites' },
    { value: 'downtown-plaza', label: 'Downtown Plaza Construction' },
    { value: 'riverside-towers', label: 'Riverside Towers Project' },
    { value: 'industrial-park', label: 'Industrial Park Development' },
    { value: 'suburban-complex', label: 'Suburban Housing Complex' }
  ];

  const getChartData = (): ChartData | undefined => {
    const data = analyticsData?.[timeRange] || analyticsData?.monthly;
    return data;
  };

  const chartData = getChartData();

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-card rounded-xl shadow-elevation-2 p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1">
              Analytics & Reports
            </h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive workforce and cost analysis
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onExportPDF}
            >
              Export PDF
            </Button>
            <Button
              onClick={onExportExcel}
            >
              Export Excel
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Select
              options={timeRangeOptions}
              value={timeRange}
              onChange={(value: TimeRange) => setTimeRange(value)}
              placeholder="Select time range"
            />
          </div>
          <div className="flex-1">
            <Select
              options={siteOptions}
              value={selectedSite}
              onChange={(value: string) => setSelectedSite(value)}
              placeholder="Select site"
            />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-card rounded-xl p-4 md:p-6 shadow-elevation-2">
          <p>Total Labor Cost</p>
          <h4>${chartData?.totalCost?.toLocaleString()}</h4>
        </div>

        <div className="bg-card rounded-xl p-4 md:p-6 shadow-elevation-2">
          <p>Total Hours Worked</p>
          <h4>{chartData?.totalHours?.toLocaleString()}</h4>
        </div>

        <div className="bg-card rounded-xl p-4 md:p-6 shadow-elevation-2">
          <p>Average Daily Cost</p>
          <h4>${chartData?.avgDailyCost?.toLocaleString()}</h4>
        </div>

        <div className="bg-card rounded-xl p-4 md:p-6 shadow-elevation-2">
          <p>Active Workers</p>
          <h4>{chartData?.activeWorkers}</h4>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-card rounded-xl shadow-elevation-2 p-4 md:p-6">
        {chartData?.siteBreakdown?.map((site, index) => {
          const percentage =
            chartData?.totalCost && chartData.totalCost > 0
              ? (site.cost / chartData.totalCost) * 100
              : 0;

          return (
            <div key={index}>
              <span>{site.name}</span>
              <span>${site.cost.toLocaleString()}</span>
              <div style={{ width: `${percentage}%` }} />
            </div>
          );
        })}
      </div>

      {/* Monthly Trend */}
      <div className="bg-card rounded-xl shadow-elevation-2 p-4 md:p-6">
        {chartData?.monthlyTrend?.map((month, index) => {
          const maxCost =
            chartData.monthlyTrend.length > 0
              ? Math.max(...chartData.monthlyTrend.map(m => m.cost))
              : 0;

          const barWidth =
            maxCost > 0 ? (month.cost / maxCost) * 100 : 0;

          return (
            <div key={index}>
              <span>{month.month}</span>
              <div style={{ width: `${barWidth}%` }}>
                ${month.cost.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Workers */}
      <div className="bg-card rounded-xl shadow-elevation-2 p-4 md:p-6">
        {chartData?.topWorkers?.map((worker, index) => (
          <div key={index}>
            <p>{worker.name}</p>
            <p>{worker.site}</p>
            <p>{worker.hours}h</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;