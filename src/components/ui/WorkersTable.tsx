import { Link } from "react-router-dom";

interface Worker {
  id: string;
  name: string;
  dailyRate: number;
  status: string;
}

interface WorkersTableProps {
  workers: Worker[];
}

const WorkersTable = ({ workers }: WorkersTableProps) => {
  return (
    <table className="min-w-full bg-white shadow rounded overflow-hidden">
      <thead className="bg-gray-200">
        <tr>
          <th className="px-4 py-2 text-left">Name</th>
          <th className="px-4 py-2">Daily Rate</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {workers.map((worker) => (
          <tr key={worker.id} className="border-b hover:bg-gray-50">
            <td className="px-4 py-2">{worker.name}</td>
            <td className="px-4 py-2">${worker.dailyRate}</td>
            <td className="px-4 py-2">{worker.status}</td>
            <td className="px-4 py-2">
              <Link
                to={`/foreman/add-daily-record?workerId=${worker.id}`}
                className="text-blue-600 hover:underline"
              >
                Add Record
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WorkersTable;
