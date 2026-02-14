import Sidebar from "../../components/layout/Slidebar";
import Header from "../../components/layout/Header";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import { useAuth } from "../../app/providers";

const dummyLaborCard = [
  { date: "2026-02-01", hours: 8, amount: 20, status: "Paid" },
  { date: "2026-02-02", hours: 7, amount: 17.5, status: "Paid" },
  { date: "2026-02-03", hours: 6, amount: 15, status: "Unpaid" },
];

const LaborerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Dashboard content */}
        <main className="p-6 bg-gray-100 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}</h1>

          {/* Labor Card */}
          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-4">My Labor Card</h2>
            <Table headers={["Date", "Hours", "Amount", "Status"]}>
              {dummyLaborCard.map((record, idx) => (
                <tr key={idx} className="border-b">
                  <td className="px-4 py-2">{record.date}</td>
                  <td className="px-4 py-2">{record.hours}</td>
                  <td className="px-4 py-2">${record.amount}</td>
                  <td className="px-4 py-2">{record.status}</td>
                </tr>
              ))}
            </Table>
          </Card>

          {/* Payment Summary */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <h3 className="font-semibold">Total Earned</h3>
              <p>${dummyLaborCard.reduce((sum, r) => sum + r.amount, 0)}</p>
            </Card>
            <Card>
              <h3 className="font-semibold">Total Paid</h3>
              <p>${dummyLaborCard.filter(r => r.status === "Paid").reduce((sum, r) => sum + r.amount, 0)}</p>
            </Card>
            <Card>
              <h3 className="font-semibold">Balance Due</h3>
              <p>${dummyLaborCard.filter(r => r.status !== "Paid").reduce((sum, r) => sum + r.amount, 0)}</p>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LaborerDashboard;
