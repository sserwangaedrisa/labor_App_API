import React from 'react';
import Icon from '../../../components/ui/AppIconl';

interface QuickActionsPanelProps {
  onBulkAttendance: () => void;
  onViewReports: () => void;
  onSiteSettings: () => void;
}

interface ActionItem {
  id: string;
  label: string;
  description: string;
  iconName: string;
  iconColor: string;
  onClick: () => void;
}

const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  onBulkAttendance,
  onViewReports,
  onSiteSettings,
}) => {
  const actions: ActionItem[] = [
    {
      id: 'bulk',
      label: 'Bulk Attendance',
      description: 'Record multiple workers',
      iconName: 'Users',
      iconColor: 'var(--color-primary)',
      onClick: onBulkAttendance,
    },
    {
      id: 'reports',
      label: 'Site Reports',
      description: 'View analytics',
      iconName: 'BarChart3',
      iconColor: 'var(--color-success)',
      onClick: onViewReports,
    },
    {
      id: 'settings',
      label: 'Site Settings',
      description: 'Manage preferences',
      iconName: 'Settings',
      iconColor: 'var(--color-secondary)',
      onClick: onSiteSettings,
    },
  ];

  return (
    <div className="bg-card rounded-xl shadow-elevation-2 p-4 md:p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 md:text-xl">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {actions?.map((action) => (
          <button
            key={action?.id}
            onClick={action?.onClick}
            className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-smooth text-left focus-ring"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${action?.iconColor}20` }}
            >
              <Icon
                name={action?.iconName}
                size={20}
                color={action?.iconColor}
              />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground text-sm mb-1">
                {action?.label}
              </p>
              <p className="caption text-muted-foreground text-xs">
                {action?.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsPanel;
