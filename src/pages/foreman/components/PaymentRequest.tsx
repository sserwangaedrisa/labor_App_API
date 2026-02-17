import React from 'react';
import Icon from '../../../components/ui/AppIconl'
import Button from '../../../components/ui/Button';

interface PaymentRequestCardProps {
  pendingRequests: number;
  onSubmitRequest: () => void;
  onViewHistory: () => void;
}

const PaymentRequestCard: React.FC<PaymentRequestCardProps> = ({
  pendingRequests,
  onSubmitRequest,
  onViewHistory,
}) => {
  return (
    <div className="bg-card rounded-xl shadow-elevation-2 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center md:w-12 md:h-12">
            <Icon
            key = "dollaSign"
              name="DollarSign"
              size={20}
              color="var(--color-warning)"
              className="md:w-6 md:h-6"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground md:text-xl">
              Payment Requests
            </h3>
            <p className="caption text-muted-foreground text-xs md:text-sm">
              Submit completed timesheet
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground md:text-base">
              Pending Submissions
            </span>
            <span className="text-2xl font-semibold text-foreground md:text-3xl">
              {pendingRequests}
            </span>
          </div>
          <p className="text-xs text-muted-foreground md:text-sm">
            Workers with completed hours awaiting payment request
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={onSubmitRequest}
          >
            Submit Payment Request
          </Button>
          <Button
            onClick={onViewHistory}
            className="sm:w-auto"
          >
            View History
          </Button>
        </div>

        <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 flex gap-3">
          <Icon
            name="Info"
            size={18}
            color="var(--color-accent)"
            className="flex-shrink-0 mt-0.5"
          />
          <p className="text-xs text-foreground md:text-sm">
            Payment requests are reviewed by site owners. Late submissions (entries made after 24 hours) will be flagged for verification.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentRequestCard;
