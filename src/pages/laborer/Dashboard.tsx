import Sidebar from "../../components/layout/Slidebar";
import Header from "../../components/layout/Header";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import LaborCard from "./components/LaborCard";
import { Link } from "react-router";
import AttendanceCalendar from "./components/AttendenceCalender";
import { useAuth } from "../../app/providers";

const dummyLaborCard = [
  { date: "2026-02-01", hours: 8, amount: 20, status: "Paid" },
  { date: "2026-02-02", hours: 7, amount: 17.5, status: "Paid" },
  { date: "2026-02-03", hours: 6, amount: 15, status: "Unpaid" },
];

 const attendanceRecords = [
  {
    date: '2026-01-24',
    hours: 8,
    earnings: 200.00,
    status: 'Pending' as const,
    notes: 'Regular shift - Foundation work'
  },
  {
    date: '2026-01-23',
    hours: 9,
    earnings: 225.00,
    status: 'Pending' as const,
    notes: 'Overtime approved - Steel framing'
  },
  {
    date: '2026-01-22',
    hours: 8,
    earnings: 200.00,
    status: 'Paid' as const,
    notes: 'Regular shift - Concrete pouring'
  },
  {
    date: '2026-01-21',
    hours: 8,
    earnings: 200.00,
    status: 'Paid' as const,
    notes: 'Regular shift - Site preparation'
  },
  {
    date: '2026-01-20',
    hours: 7,
    earnings: 175.00,
    status: 'Paid' as const,
    notes: 'Early finish - Weather conditions'
  },
  {
    date: '2026-01-17',
    hours: 8,
    earnings: 200.00,
    status: 'Locked' as const,
    notes: 'Regular shift - Equipment installation'
  },
  {
    date: '2026-01-16',
    hours: 8,
    earnings: 200.00,
    status: 'Locked' as const,
    notes: 'Regular shift - Scaffolding setup'
  },
  {
    date: '2026-01-15',
    hours: 9,
    earnings: 225.00,
    status: 'Locked' as const,
    notes: 'Overtime - Deadline push'
  },
  {
    date: '2026-01-14',
    hours: 8,
    earnings: 200.00,
    status: 'Locked' as const,
    notes: 'Regular shift - Material handling'
  },
  {
    date: '2026-01-13',
    hours: 8,
    earnings: 200.00,
    status: 'Locked' as const,
    notes: 'Regular shift - Excavation work'
  },
  {
    date: '2026-01-10',
    hours: 8,
    earnings: 200.00,
    status: 'Locked' as const,
    notes: 'Regular shift - Formwork assembly'
  },
  {
    date: '2026-01-09',
    hours: 8,
    earnings: 200.00,
    status: 'Locked' as const,
    notes: 'Regular shift - Rebar installation'
  },
  {
    date: '2026-01-08',
    hours: 7.5,
    earnings: 187.50,
    status: 'Locked' as const,
    notes: 'Partial day - Safety training'
  },
  {
    date: '2026-01-07',
    hours: 8,
    earnings: 200.00,
    status: 'Locked' as const,
    notes: 'Regular shift - Site cleanup'
  },
  {
    date: '2026-01-06',
    hours: 8,
    earnings: 200.00,
    status: 'Locked' as const,
    notes: 'Regular shift - Foundation inspection'
  },
  {
    date: '2026-01-03',
    hours: 8,
    earnings: 200.00,
    status: 'Locked' as const,
    notes: 'Regular shift - Equipment maintenance'
  },
  {
    date: '2026-01-02',
    hours: 8,
    earnings: 200.00,
    status: 'Locked' as const,
    notes: 'Regular shift - Material delivery'
  }];

  const DummyWorker= {
  
    id: '12345',
    name: 'John Doe',
    role: 'Electrician',
    photo: '/src/assets/hero.png',
    photoAlt: 'John Doe',
    paymentStatus: 'Pending' as const,
    currentSite: 'Downtown Construction',
    wageRate: 25,
    phone: '555-1234',
    daysWorked: 15,
    totalHours: 120,
    totalEarnings: 3000
  }
  

  const paymentHistory = [
  {
    amount: 1600.00,
    date: '2026-01-22T14:30:00',
    description: 'Weekly payment for Jan 13-19, 2026',
    method: 'Bank Transfer',
    transactionId: 'TXN-2026-001-0122',
    processedBy: 'Sarah Johnson',
    auditTrail: true
  },
  {
    amount: 1400.00,
    date: '2026-01-15T15:45:00',
    description: 'Weekly payment for Jan 6-12, 2026',
    method: 'Bank Transfer',
    transactionId: 'TXN-2026-001-0115',
    processedBy: 'Sarah Johnson',
    auditTrail: true
  },
  {
    amount: 1600.00,
    date: '2026-01-08T16:20:00',
    description: 'Weekly payment for Dec 30-Jan 5, 2026',
    method: 'Bank Transfer',
    transactionId: 'TXN-2025-012-3108',
    processedBy: 'Michael Chen',
    auditTrail: true
  },
  {
    amount: 800.00,
    date: '2026-01-03T10:15:00',
    description: 'Bonus payment - Year-end performance',
    method: 'Bank Transfer',
    transactionId: 'TXN-2026-001-0103',
    processedBy: 'Sarah Johnson',
    auditTrail: true
  }];



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

          <div className="mt-6">
            <LaborCard worker={DummyWorker} />
          </div>

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

            <div className="col-span-3">
                <AttendanceCalendar attendanceRecords={attendanceRecords} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LaborerDashboard;
