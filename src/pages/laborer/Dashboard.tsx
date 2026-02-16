import AuthenticationHeader from "../../components/ui/AuthenticatedHeader";
import LaborCard from "./components/LaborCard";
import AttendanceTable from "./components/AttendanceTable";
import AttendanceCalendar from "./components/AttendenceCalender";
import PaymentHistory from "./components/PaymentHistory";
import RoleGuard from "../../components/ui/RoleGuard";
import LoadingBoundary from "../../components/ui/LoadingBoundary";
import { getUser } from "../../utils/mockAuth";
import { useState, useEffect } from "react";


const LaborerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const currentUser = getUser();

  const workerData = {
    id: 'LAB001',
    name: 'John Martinez',
    role: 'Construction Laborer',
    photo: "https://img.rocket.new/generatedImages/rocket_gen_img_1d29504f2-1763294463041.png",
    photoAlt: 'Professional headshot of Hispanic male construction worker with short black hair wearing orange safety vest and white hard hat',
    currentSite: 'Downtown Plaza Construction',
    wageRate: 25.00,
    phone: '+1 (555) 123-4567',
    daysWorked: 18,
    totalHours: 144,
    totalEarnings: 3600.00,
    paymentStatus: 'Pending' as const
  };

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




  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <RoleGuard
      allowedRoles={['laborer']}
      fallbackRoute="/login">

      <div className="min-h-screen bg-background">
        <AuthenticationHeader/>
        
        <LoadingBoundary loading={loading} fullScreen>
          <main className="pt-[60px]">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
              <div className="mb-6 md:mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-2">
                  Welcome back, {workerData?.name?.split(' ')?.[0]}
                </h1>
                <p className="text-base md:text-lg text-muted-foreground">
                  View your labor card, attendance records, and payment history
                </p>
              </div>

              <div className="space-y-6 md:space-y-8">
                <LaborCard worker={workerData} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                  <div className="lg:col-span-2">
                    <AttendanceCalendar attendanceRecords={attendanceRecords} />
                  </div>
                </div>

                <AttendanceTable attendanceRecords={attendanceRecords} />

                <PaymentHistory payments={paymentHistory} />
              </div>
            </div>
          </main>
        </LoadingBoundary>
      </div>
    </RoleGuard>);

};



export default LaborerDashboard;
