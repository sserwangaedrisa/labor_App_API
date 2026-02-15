import React from 'react';
import Icon from '../../../components/ui/AppIconl';
import Image from '../../../components/ui/AppImage';

/* =========================
   Types
========================= */

export type PaymentStatus = 'Unpaid' | 'Pending' | 'Paid' | 'Locked';

export interface Worker {
  id: string;
  name: string;
  role: string;
  photo: string;
  photoAlt: string;
  paymentStatus: PaymentStatus;
  currentSite: string;
  wageRate: number;
  phone: string;
  daysWorked: number;
  totalHours: number;
  totalEarnings: number;
}

interface LaborCardProps {
  worker: Worker;
}

/* =========================
   Component
========================= */

const LaborCard: React.FC<LaborCardProps> = ({ worker }) => {
  const getStatusColor = (status: PaymentStatus): string => {
    const colors: Record<PaymentStatus, string> = {
      Unpaid: 'bg-warning/10 text-warning border-warning/20',
      Pending: 'bg-accent/10 text-accent border-accent/20',
      Paid: 'bg-success/10 text-success border-success/20',
      Locked: 'bg-muted text-muted-foreground border-border'
    };

    return colors[status] || colors.Unpaid;
  };

  const getStatusIcon = (status: PaymentStatus) => {
    const icons: Record<PaymentStatus, 'Clock' | 'AlertCircle' | 'CheckCircle' | 'Lock'> = {
      Unpaid: 'Clock',
      Pending: 'AlertCircle',
      Paid: 'CheckCircle',
      Locked: 'Lock'
    };

    return icons[status];
  };

  return (
    <div className="bg-card rounded-xl shadow-elevation-3 overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-secondary p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          
          <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full border-4 border-white/20 overflow-hidden flex-shrink-0 shadow-elevation-4">
            <Image
              src={worker.photo}
              alt={worker.photoAlt}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-2">
              {worker.name}
            </h2>

            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2 text-white/90">
                <Icon key='briefcase' name="Briefcase" size={18} />
                <span className="text-sm md:text-base">{worker.role}</span>
              </div>

              <div className="flex items-center gap-2 text-white/90">
                <Icon key='hash' name="Hash" size={18} />
                <span className="text-sm md:text-base font-medium">
                  ID: {worker.id}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`px-4 py-2 rounded-lg border-2 ${getStatusColor(
              worker.paymentStatus
            )} flex items-center gap-2 flex-shrink-0`}
          >
            <Icon key="status-icon" name={getStatusIcon(worker.paymentStatus)} size={20} />
            <span className="font-semibold text-sm md:text-base">
              {worker.paymentStatus}
            </span>
          </div>

        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          
          <InfoItem
            icon="MapPin"
            label="Current Site"
            value={worker.currentSite}
            color="var(--color-primary)"
          />

          <InfoItem
            icon="DollarSign"
            label="Wage Rate"
            value={`$${worker.wageRate}/hour`}
            color="var(--color-primary)"
          />

          <InfoItem
            icon="Phone"
            label="Contact"
            value={worker.phone}
            color="var(--color-primary)"
          />

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">

          <InfoItem
            icon="Calendar"
            label="Days Worked (This Month)"
            value={`${worker.daysWorked} days`}
            color="var(--color-success)"
            bg="bg-success/10"
          />

          <InfoItem
            icon="Clock"
            label="Total Hours (This Month)"
            value={`${worker.totalHours} hours`}
            color="var(--color-success)"
            bg="bg-success/10"
          />

          <InfoItem
            icon="Wallet"
            label="Total Earnings (This Month)"
            value={`$${worker.totalEarnings.toFixed(2)}`}
            color="var(--color-accent)"
            bg="bg-accent/10"
            large
          />

        </div>
      </div>
    </div>
  );
};

/* =========================
   Reusable Info Item
========================= */

interface InfoItemProps {
  icon: React.ComponentProps<typeof Icon>['name'];
  label: string;
  value: string;
  color: string;
  bg?: string;
  large?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({
  icon,
  label,
  value,
  color,
  bg = 'bg-primary/10',
  large = false
}) => (
  <div className="flex items-start gap-3">
    <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
      <Icon key={icon} name={icon} size={20} color={color} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="caption text-muted-foreground text-xs mb-1">
        {label}
      </p>
      <p
        className={`font-semibold text-foreground ${
          large
            ? 'text-lg md:text-xl lg:text-2xl'
            : 'text-sm md:text-base'
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);

export default LaborCard;
