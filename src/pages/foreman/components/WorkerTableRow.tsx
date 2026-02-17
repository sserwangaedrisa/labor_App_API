import React from 'react';
import Image from '../../../components/ui/AppImage';
import Icon from '../../../components/ui/AppIconl';
import Button from '../../../components/ui/Button';
import WorkerStatusBadge from './WorkerStatusBadge';

type WorkerStatus = 'present' | 'absent' | 'pending' | 'late';

interface Worker {
  id: string | number;
  name: string;
  avatar: string;
  avatarAlt: string;
  role: string;
  todayStatus: WorkerStatus;
  hoursToday: number;
  wageRate: number;
}

interface WorkerTableRowProps {
  worker: Worker;
  onRecordAttendance: (worker: Worker) => void;
  onViewDetails: (worker: Worker) => void;
}

const WorkerTableRow: React.FC<WorkerTableRowProps> = ({
  worker,
  onRecordAttendance,
  onViewDetails,
}) => {
  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-smooth">
      <td className="px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 md:w-12 md:h-12">
            <Image
              src={worker.avatar}
              alt={worker.avatarAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground text-sm truncate md:text-base">
              {worker.name}
            </p>
            <p className="caption text-muted-foreground text-xs truncate">
              ID: {worker.id}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3 hidden md:table-cell md:px-6 md:py-4">
        <span className="text-sm text-foreground">{worker.role}</span>
      </td>

      <td className="px-4 py-3 md:px-6 md:py-4">
        <WorkerStatusBadge status={worker.todayStatus} />
      </td>

      <td className="px-4 py-3 hidden lg:table-cell md:px-6 md:py-4">
        <span className="data-text text-sm text-foreground font-medium">
          {worker.hoursToday}h
        </span>
      </td>

      <td className="px-4 py-3 hidden lg:table-cell md:px-6 md:py-4">
        <span className="data-text text-sm text-foreground">
          ${worker.wageRate}/day
        </span>
      </td>

      <td className="px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center gap-2 justify-end">
          <Button
            onClick={() => onRecordAttendance(worker)}
            className="hidden md:inline-flex"
          >
            Record
          </Button>

          <Button
            onClick={() => onRecordAttendance(worker)}
            className="md:hidden"
          >
            <Icon name="Clock" size={18} />
          </Button>

          <Button
            onClick={() => onViewDetails(worker)}
          >
            <Icon name="Eye" size={18} />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default WorkerTableRow;
