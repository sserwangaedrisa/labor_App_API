import Header from "../../components/layout/Header";
import Card from "../../components/ui/Card";
import MonthlyExpenseChart from "../../components/charts/MonthlyExpenseChart";
import WorkerPaymentChart from "../../components/charts/WorkerPaymentChart";
import { Link } from "react-router";

const OwnerDashboard = () => {
  const summary = {
    totalSites: 4,
    totalWorkers: 48,
    totalMonthlyCost: 18500,
    pendingPayments: 3200,
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6 bg-gray-100 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Owner Overview</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Link to="/owner/sites">
              <Card>Total Sites: {summary.totalSites}</Card>
            </Link>
            <Card>Total Workers: {summary.totalWorkers}</Card>
            <Card>Monthly Cost: ${summary.totalMonthlyCost}</Card>
            <Card>Pending Payments: ${summary.pendingPayments}</Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <h2 className="font-semibold mb-4">Monthly Expenses</h2>
              <MonthlyExpenseChart />
            </Card>

            <Card>
              <h2 className="font-semibold mb-4">Worker Payments</h2>
              <WorkerPaymentChart />
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;
