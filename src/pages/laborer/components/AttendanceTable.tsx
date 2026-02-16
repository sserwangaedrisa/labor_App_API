import React, { useState } from 'react';
import Icon from '../../../components/ui/AppIconl';

interface AttendanceRecord {
  date: string;
  hours: number;
  earnings: number;
  status: string;
  notes?: string;
}

interface AttendanceTableProps {
  attendanceRecords: AttendanceRecord[];
}

const AttendanceTable = ({ attendanceRecords }: AttendanceTableProps) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const getStatusColor = (status: string) => {
    const colors = {
      Unpaid: 'bg-warning/10 text-warning',
      Pending: 'bg-accent/10 text-accent',
      Paid: 'bg-success/10 text-success',
      Locked: 'bg-muted text-muted-foreground'
    };
    return colors?.[status as keyof typeof colors] || colors?.Unpaid;
  };


  const getStatusIcon = (status: string): "Clock" | "AlertCircle" | "CheckCircle" | "Lock" | "HelpCircle" => {
  const icons: Record<string, "Clock" | "AlertCircle" | "CheckCircle" | "Lock" | "HelpCircle"> = {
    Unpaid: "Clock",
    Pending: "AlertCircle",
    Paid: "CheckCircle",
    Locked: "Lock",
  };

  return icons[status] ?? "HelpCircle"; // fallback icon
};


  const sortedRecords = [...attendanceRecords]?.sort((a, b) => {
    if (sortConfig?.key === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortConfig?.direction === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    }
    if (sortConfig?.key === 'hours') {
      return sortConfig?.direction === 'asc' ? a?.hours - b?.hours : b?.hours - a?.hours;
    }
    if (sortConfig?.key === 'earnings') {
      return sortConfig?.direction === 'asc' ? a?.earnings - b?.earnings : b?.earnings - a?.earnings;
    }
    return 0;
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedRecords?.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(sortedRecords?.length / recordsPerPage);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-card rounded-xl shadow-elevation-3 overflow-hidden">
      <div className="p-4 md:p-6 lg:p-8 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
            Attendance Records
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon key = "fileText" name="FileText" size={18} />
            <span>{sortedRecords?.length} total records</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center gap-2 text-xs md:text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Date
                  <Icon key = "dateSort"
                    name={sortConfig?.key === 'date' && sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                    size={16} 
                  />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left">
                <button
                  onClick={() => handleSort('hours')}
                  className="flex items-center gap-2 text-xs md:text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Hours
                  <Icon key = "hours"
                    name={sortConfig?.key === 'hours' && sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                    size={16} 
                  />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left">
                <button
                  onClick={() => handleSort('earnings')}
                  className="flex items-center gap-2 text-xs md:text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Earnings
                  <Icon key = "earnings"
                    name={sortConfig?.key === 'earnings' && sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                    size={16} 
                  />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left">
                <span className="text-xs md:text-sm font-semibold text-foreground">Status</span>
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left">
                <span className="text-xs md:text-sm font-semibold text-foreground">Notes</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {currentRecords?.map((record, index) => (
              <tr key={index} className="hover:bg-muted/30 transition-smooth">
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <div className="flex items-center gap-2">
                    <Icon key='calendar' name="Calendar" size={16} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-sm md:text-base text-foreground font-medium whitespace-nowrap">
                      {formatDate(record?.date)}
                    </span>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <div className="flex items-center gap-2">
                    <Icon key={`clock-${index}`} name="Clock" size={16} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-sm md:text-base text-foreground font-semibold whitespace-nowrap">
                      {record?.hours}h
                    </span>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <div className="flex items-center gap-2">
                    <Icon key='dollarSign' name="DollarSign" size={16} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-sm md:text-base text-foreground font-semibold whitespace-nowrap">
                      ${record?.earnings?.toFixed(2)}
                    </span>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getStatusColor(record?.status)}`}>
                    <Icon key={record?.status} name={getStatusIcon(record?.status)} size={14} />
                    <span className="text-xs md:text-sm font-semibold whitespace-nowrap">{record?.status}</span>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <span className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                    {record?.notes || 'No notes'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="p-4 md:p-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, sortedRecords?.length)} of {sortedRecords?.length} records
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
                <Icon  key='chevronLeft' name="ChevronLeft" size={20} />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)]?.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-smooth focus-ring ${
                    currentPage === i + 1
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <Icon key='chevronRight' name="ChevronRight" size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;