import React, { useState } from 'react';
import Icon from '../../../components/ui/AppIconl';

/* =========================
   Types
========================= */

export type AttendanceStatus = 'Locked' | 'Paid' | 'Pending' | 'Unpaid';

export interface AttendanceRecord {
  date: string; // ISO string
  status: AttendanceStatus;
  hours: number;
}

interface AttendanceCalendarProps {
  attendanceRecords: AttendanceRecord[];
}

/* =========================
   Component
========================= */

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  attendanceRecords
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(2026, 0, 1)
  );

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getAttendanceForDate = (date: Date): AttendanceRecord | undefined => {
    return attendanceRecords.find((record) => {
      const recordDate = new Date(record.date);
      return recordDate.toDateString() === date.toDateString();
    });
  };

  const getDateColor = (attendance?: AttendanceRecord): string => {
    if (!attendance) return 'bg-muted/30 text-muted-foreground';

    const statusColors: Record<AttendanceStatus, string> = {
      Locked: 'bg-muted text-muted-foreground',
      Paid: 'bg-success/20 text-success border border-success/30',
      Pending: 'bg-accent/20 text-accent border border-accent/30',
      Unpaid: 'bg-warning/20 text-warning border border-warning/30'
    };

    return statusColors[attendance.status] || statusColors.Unpaid;
  };

  const navigateMonth = (direction: number): void => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const { daysInMonth, startingDayOfWeek, year, month } =
    getDaysInMonth(currentMonth);

  const monthName = currentMonth.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });

  const weekDays: string[] = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ];

  const calendarDays: (number | null)[] = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="bg-card rounded-xl shadow-elevation-3 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
          Attendance Calendar
        </h3>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth focus-ring"
            aria-label="Previous month"
          >
            <Icon key="chevron-left" name="ChevronLeft" size={20} />
          </button>

          <span className="text-sm md:text-base font-medium text-foreground px-3 whitespace-nowrap">
            {monthName}
          </span>

          <button
            onClick={() => navigateMonth(1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth focus-ring"
            aria-label="Next month"
          >
            <Icon key="chevron-right" name="ChevronRight" size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 md:gap-3 mb-3">
        {weekDays.map((day) => (
          <div key={day} className="text-center">
            <span className="caption text-muted-foreground text-xs md:text-sm font-medium">
              {day}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 md:gap-3">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const date = new Date(year, month, day);
          const attendance = getAttendanceForDate(date);
          const isToday =
            date.toDateString() === new Date().toDateString();

          return (
            <div
              key={day}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-smooth ${
                getDateColor(attendance)
              } ${isToday ? 'ring-2 ring-primary' : ''}`}
            >
              <span className="text-sm md:text-base font-semibold">
                {day}
              </span>

              {attendance && (
                <span className="text-xs mt-1 font-medium whitespace-nowrap">
                  {attendance.hours}h
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 md:mt-8 pt-6 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Legend color="bg-success/20 border-success/30" label="Paid" />
          <Legend color="bg-accent/20 border-accent/30" label="Pending" />
          <Legend color="bg-warning/20 border-warning/30" label="Unpaid" />
          <Legend color="bg-muted" label="Locked" />
        </div>
      </div>
    </div>
  );
};

/* =========================
   Small Internal Component
========================= */

interface LegendProps {
  color: string;
  label: string;
}

const Legend: React.FC<LegendProps> = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-4 h-4 rounded ${color} border flex-shrink-0`}
    />
    <span className="text-xs md:text-sm text-muted-foreground">
      {label}
    </span>
  </div>
);

export default AttendanceCalendar;
