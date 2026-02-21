import React, { useState } from 'react';
import Icon from '../../../components/ui/AppIconl';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import type { Payment } from '../../../types/SharedTypes';

/* ================= TYPES ================= */

type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'locked' | string;


interface PaymentApprovalQueueProps {
  payments?: Payment[];
  onApprove: (payment: Payment) => void;
  onReject: (payment: Payment) => void;
}

/* ================= COMPONENT ================= */

const PaymentApprovalQueue: React.FC<PaymentApprovalQueueProps> = ({
  payments,
  onApprove,
  onReject
}) => {
  const [selectedPayments, setSelectedPayments] = useState<(string | number)[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredPayments = payments?.filter(payment => {
    if (filterStatus === 'all') return true;
    return payment?.status?.toLowerCase() === filterStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayments(filteredPayments?.map(p => p?.id) || []);
    } else {
      setSelectedPayments([]);
    }
  };

  const handleSelectPayment = (paymentId: string | number, checked: boolean) => {
    if (checked) {
      setSelectedPayments([...selectedPayments, paymentId]);
    } else {
      setSelectedPayments(selectedPayments?.filter(id => id !== paymentId));
    }
  };

  const handleBatchApprove = () => {
    selectedPayments?.forEach(id => {
      const payment = payments?.find(p => p?.id === id);
      if (payment) onApprove(payment);
    });
    setSelectedPayments([]);
  };

  const getStatusColor = (status: PaymentStatus): string => {
    const colors: Record<string, string> = {
      unpaid: 'bg-muted text-muted-foreground',
      pending: 'bg-warning/10 text-warning',
      paid: 'bg-success/10 text-success',
      locked: 'bg-primary/10 text-primary'
    };
    return colors?.[status?.toLowerCase()] || colors?.unpaid;
  };

  const getStatusIcon = (status: PaymentStatus): string => {
    const icons: Record<string, string> = {
      unpaid: 'Clock',
      pending: 'AlertCircle',
      paid: 'CheckCircle',
      locked: 'Lock'
    };
    return icons?.[status?.toLowerCase()] || 'Clock';
  };

  return (
    <div className="bg-card rounded-xl shadow-elevation-2 overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1">
              Payment Approval Queue
            </h3>
            <p className="text-sm text-muted-foreground">
              {filteredPayments?.length} payment
              {filteredPayments?.length !== 1 ? 's' : ''} pending review
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setFilterStatus('all')}>
              All
            </button>
            <button onClick={() => setFilterStatus('pending')}>
              Pending
            </button>
            <button onClick={() => setFilterStatus('unpaid')}>
              Unpaid
            </button>
          </div>
        </div>

        {selectedPayments?.length > 0 && (
          <div className="mt-4">
            <p>
              {selectedPayments?.length} payment
              {selectedPayments?.length !== 1 ? 's' : ''} selected
            </p>
            <Button onClick={handleBatchApprove}>
              Approve Selected
            </Button>
            <Button onClick={() => setSelectedPayments([])}>
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th>
                <Checkbox
                  checked={
                    selectedPayments?.length === filteredPayments?.length &&
                    (filteredPayments?.length || 0) > 0
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleSelectAll(e.target.checked)
                  }
                  indeterminate={
                    selectedPayments?.length > 0 &&
                    selectedPayments?.length < (filteredPayments?.length || 0)
                  }
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments?.map(payment => (
              <tr key={payment?.id}>
                <td>
                  <Checkbox
                    checked={selectedPayments?.includes(payment?.id)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleSelectPayment(payment?.id, e.target.checked)
                    }
                  />
                </td>
                <td>{payment?.workerName}</td>
                <td>{payment?.siteName}</td>
                <td>{payment?.period}</td>
                <td>${payment?.amount?.toLocaleString()}</td>
                <td>
                  <span className={getStatusColor(payment?.status)}>
                    <Icon name={getStatusIcon(payment?.status)} size={12} />
                    {payment?.status}
                  </span>
                </td>
                <td>
                  <Button onClick={() => onApprove(payment)}>Approve</Button>
                  <Button onClick={() => onReject(payment)}>Reject</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPayments?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Inbox" size={32} />
          <p>No Payments Found</p>
        </div>
      )}
    </div>
  );
};

export default PaymentApprovalQueue;