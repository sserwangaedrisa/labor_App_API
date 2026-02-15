import OwnerLayout from "../../components/layout/OwnerLayout";

const workers = [
  { id: 1, name: "Mike", site: "Downtown Project", status: "Active" },
  { id: 2, name: "Sarah", site: "Mall Expansion", status: "Active" },
  { id: 3, name: "Daniel", site: "Bridge Repair", status: "Inactive" },
];

const WorkersPage = () => {
  return (
    <OwnerLayout>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Workers Management</h1>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow">
          + Add Worker
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-4">Name</th>
              <th>Site</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => (
              <tr key={worker.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{worker.name}</td>
                <td className="text-center">{worker.site}</td>
                <td
                  className={`text-center font-semibold ${
                    worker.status === "Active"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {worker.status}
                </td>
                <td className="text-center">
                  <button className="text-blue-600 hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </OwnerLayout>
  );
};

export default WorkersPage;
