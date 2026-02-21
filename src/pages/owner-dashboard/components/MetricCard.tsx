import React from 'react';
import Icon from '../../../components/ui/AppIconl';

/* ================= TYPES ================= */

type TrendDirection = 'up' | 'down';

interface MetricCardProps {
  title: string;
  value: string | number;
  iconName: string;
  trend?: TrendDirection;
  trendValue?: string | number;
  iconBgColor?: string;
  iconColor?: string;
}

/* ================= COMPONENT ================= */

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  iconName, 
  trend, 
  trendValue, 
  iconBgColor = 'bg-primary/10',
  iconColor = 'var(--color-primary)'
}) => {
  return (
    <div className="bg-card rounded-xl p-4 md:p-6 shadow-elevation-2 hover-lift transition-smooth">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex-1">
          <p className="caption text-muted-foreground text-xs md:text-sm mb-1">
            {title}
          </p>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground data-text">
            {value}
          </h3>
        </div>
        <div className={`w-10 h-10 md:w-12 md:h-12 ${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon 
            name={iconName} 
            size={20} 
            color={iconColor} 
            className="md:w-6 md:h-6" 
          />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-1.5">
          <Icon 
            name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
            size={14} 
            color={trend === 'up' ? 'var(--color-success)' : 'var(--color-destructive)'}
            className="md:w-4 md:h-4"
          />
          <span className={`text-xs md:text-sm font-medium ${
            trend === 'up' ? 'text-success' : 'text-destructive'
          }`}>
            {trendValue}
          </span>
          <span className="text-xs md:text-sm text-muted-foreground">
            vs last month
          </span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;