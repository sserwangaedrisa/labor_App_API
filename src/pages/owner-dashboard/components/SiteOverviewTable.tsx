import React, { useState } from 'react';
import Icon from '../../../components/ui/AppIconl'
import Button from '../../../components/ui/Button';
import type { Site } from '../../../types/SharedTypes';

/* ================= TYPES ================= */

type SiteStatus = 'Active' | 'Inactive' | string;


type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: keyof Site | null;
  direction: SortDirection;
}

interface SiteOverviewTableProps {
  sites: Site[];
  onViewDetails: (site: Site) => void;
  onManageWorkers: (site: Site) => void;
}

/* ================= COMPONENT ================= */

const SiteOverviewTable: React.FC<SiteOverviewTableProps> = ({
  sites,
  onViewDetails,
  onManageWorkers
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc'
  });

  const handleSort = (key: keyof Site) => {
    setSortConfig({
      key,
      direction:
        sortConfig?.key === key && sortConfig?.direction === 'asc'
          ? 'desc'
          : 'asc'
    });
  };

  const sortedSites = [...sites]?.sort((a, b) => {
    if (!sortConfig?.key) return 0;

    const aValue = a?.[sortConfig?.key];
    const bValue = b?.[sortConfig?.key];

    if (sortConfig?.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    }

    return aValue < bValue ? 1 : -1;
  });

  return (
    <div className="bg-card rounded-xl shadow-elevation-2 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Site Name
                  <Icon key = 'arrowUpDown' name="ArrowUpDown" size={14} />
                </button>
              </th>

              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('location')}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Location
                  <Icon  key = "arrowUpDown" name="ArrowUpDown" size={14} />
                </button>
              </th>

              <th className="text-center px-6 py-4">
                <button
                  onClick={() => handleSort('activeWorkers')}
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth mx-auto"
                >
                  Active Workers
                  <Icon key = "arrowUpDown" name="ArrowUpDown" size={14} />
                </button>
              </th>

              <th className="text-right px-6 py-4">
                <button
                  onClick={() => handleSort('dailyCost')}
                  className="flex items-center justify-end gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth ml-auto"
                >
                  Daily Cost
                  <Icon key = "arrowUpDown" name="ArrowUpDown" size={14} />
                </button>
              </th>

              <th className="text-right px-6 py-4">
                <button
                  onClick={() => handleSort('pendingPayments')}
                  className="flex items-center justify-end gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth ml-auto"
                >
                  Pending Payments
                  <Icon key = "arrowUpDown" name="ArrowUpDown" size={14} />
                </button>
              </th>

              <th className="text-center px-6 py-4">
                <span className="text-sm font-semibold text-foreground">
                  Status
                </span>
              </th>

              <th className="text-center px-6 py-4">
                <span className="text-sm font-semibold text-foreground">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedSites?.map((site) => (
              <tr
                key={site?.id}
                className="border-b border-border hover:bg-muted/30 transition-smooth"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon key = 'building2'
                        name="Building2"
                        size={20}
                        color="var(--color-primary)"
                      />
                    </div>
                    <span className="font-medium text-foreground">
                      {site?.name}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">
                    {site?.location}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="data-text font-semibold text-foreground">
                    {site?.activeWorkers}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <span className="data-text font-semibold text-foreground">
                    ${site?.dailyCost?.toLocaleString()}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <span className="data-text font-semibold text-warning">
                    ${site?.pendingPayments?.toLocaleString()}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        site?.status === 'Active'
                          ? 'bg-success/10 text-success'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          site?.status === 'Active'
                            ? 'bg-success'
                            : 'bg-muted-foreground'
                        }`}
                      ></span>
                      {site?.status}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      onClick={() => onViewDetails(site)}
                      className="hover:bg-primary/10"
                    >
                      View
                    </Button>

                    <Button
                      onClick={() => onManageWorkers(site)}
                      className="hover:bg-primary/10"
                    >
                      Manage
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View unchanged */}
    </div>
  );
};

export default SiteOverviewTable;