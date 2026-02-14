import Sidebar from "../../components/layout/Slidebar";
import Header from "../../components/layout/Header";
import WorkersTable from "../../components/ui/WorkersTable";
import { useAuth } from "../../app/providers";

const dummyWorkers = [
  { id: "1", name: "John Doe", dailyRate: 20, status: "Active" },
  { id: "2", name: "Jane Smith", dailyRate: 18, status: "Active" },
  { id: "3", name: "Mike Brown", dailyRate: 22, status: "Inactive" },
];

const WorkersPage = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 bg-gray-100 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">
            Workers Assigned - {user?.name}
          </h1>
          <WorkersTable workers={dummyWorkers} />
        </main>
      </div>
    </div>
  );
};

export default WorkersPage;
