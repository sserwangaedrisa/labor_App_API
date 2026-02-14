import Sidebar from "../../components/layout/Slidebar";
import Header from "../../components/layout/Header";
import Card from "../../components/ui/Card";
import SiteCostChart from "../../components/charts/SiteCostChart";
import { useAuth } from "../../app/providers";

const ForemanDashboard = () => {
  const { user } = useAuth();

  // Dummy site summary data
  const siteSummary = {
    siteName: "Site A",
    totalWorkers: 12,
    totalHours: 96,
    totalCost: 1200,
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6 bg-gray-100 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">
            Foreman Dashboard - {user?.name}
          </h1>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <h3 className="font-semibold">Workers Assigned</h3>
              <p>{siteSummary.totalWorkers}</p>
            </Card>
            <Card>
              <h3 className="font-semibold">Total Hours</h3>
              <p>{siteSummary.totalHours}</p>
            </Card>
            <Card>
              <h3 className="font-semibold">Site Cost</h3>
              <p>${siteSummary.totalCost}</p>
            </Card>
          </div>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Site Cost Chart</h2>
            <SiteCostChart data={[120, 150, 100, 200, 80, 170]} />
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ForemanDashboard;
