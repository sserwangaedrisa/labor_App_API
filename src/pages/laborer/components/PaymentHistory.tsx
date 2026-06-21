import Icon from "../../../components/ui/AppIconl";

interface PaymentHistoryProps {
  payments: {
    date: string;
    amount: number;
    method: string;
    description?: string;
    processedBy?: string;
    transactionId?: string;
    auditTrail?: boolean;
  }[];
}

const PaymentHistory = ({ payments }: PaymentHistoryProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-card rounded-xl shadow-elevation-3 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
          Payment History
        </h3>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success rounded-lg">
          <Icon key="trending-up" name="TrendingUp" size={16} />
          <span className="text-xs md:text-sm font-semibold whitespace-nowrap">
            {payments?.length} payments
          </span>
        </div>
      </div>
      <div className="space-y-4">
        {payments?.map((payment, index) => (
          <div
            key={index}
            className="bg-muted/30 rounded-lg p-4 md:p-5 hover:bg-muted/50 transition-smooth border border-border"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon
                    key={payment?.method}
                    name="Wallet2Icon"
                    size={24}
                    color="var(--color-success)"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base md:text-lg font-semibold text-foreground">
                      ${payment?.amount?.toFixed(2)}
                    </h4>
                    <div className="px-2 py-0.5 bg-success/10 text-success rounded text-xs font-medium">
                      Paid
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {payment?.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Icon key="calendar" name="Calendar" size={14} />
                      <span>{formatDate(payment?.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icon key="credit-card" name="CreditCard" size={14} />
                      <span>{payment?.method}</span>
                    </div>
                    {payment?.transactionId && (
                      <div className="flex items-center gap-1.5">
                        <Icon key="hash" name="Hash" size={14} />
                        <span className="font-mono">
                          {payment?.transactionId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 md:flex-col md:items-end">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon key="user" name="User" size={14} />
                  <span>{payment?.processedBy}</span>
                </div>
                {payment?.auditTrail && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Icon key="shield" name="Shield" size={14} />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {payments?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon
              key="inbox"
              name="Inbox"
              size={32}
              className="text-muted-foreground"
            />
          </div>
          <p className="text-muted-foreground">No payment history available</p>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
