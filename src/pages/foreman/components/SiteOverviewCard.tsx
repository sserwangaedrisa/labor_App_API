import React from 'react';
import Icon from '../../../components/ui/AppIconl';

interface Trend {
  isPositive: boolean;
  value: string;
  label: string;
}

interface SiteOverviewCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  iconName: string;
  iconColor: string;
  trend?: Trend;
}

const SiteOverviewCard: React.FC<SiteOverviewCardProps> = ({
  title,
  value,
  subtitle,
  iconName,
  iconColor,
  trend,
}) => {
  return (
    <div className="bg-card rounded-xl p-4 shadow-elevation-2 hover-lift transition-smooth md:p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="caption text-muted-foreground text-xs mb-1 md:text-sm">
            {title}
          </p>
          <h3 className="text-2xl font-semibold text-foreground md:text-3xl lg:text-4xl">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1 md:text-sm">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 md:w-12 md:h-12"
          style={{ backgroundColor: `${iconColor}20` }}
        >
          <Icon
            name={iconName}
            size={20}
            color={iconColor}
            className="md:w-6 md:h-6"
          />
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1 text-xs md:text-sm">
          <Icon
            name={trend?.isPositive ? 'TrendingUp' : 'TrendingDown'}
            size={14}
            color={
              trend?.isPositive
                ? 'var(--color-success)'
                : 'var(--color-destructive)'
            }
            className="md:w-4 md:h-4"
          />
          <span className={trend?.isPositive ? 'text-success' : 'text-destructive'}>
            {trend?.value}
          </span>
          <span className="text-muted-foreground ml-1">
            {trend?.label}
          </span>
        </div>
      )}
    </div>
  );
};

export default SiteOverviewCard;
