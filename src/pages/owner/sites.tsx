import OwnerLayout from "../../components/layout/ownerLayout";

const sites = [
  { id: 1, name: "Downtown Project", location: "City Center", cost: 7200 },
  { id: 2, name: "Bridge Repair", location: "River Side", cost: 5400 },
  { id: 3, name: "Mall Expansion", location: "North Zone", cost: 12200 },
];

const SitesPage = () => {
  return (
    <OwnerLayout>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Site Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
          + Add Site
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-4">Site</th>
              <th>Location</th>
              <th>Total Cost</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => (
              <tr key={site.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{site.name}</td>
                <td className="text-center">{site.location}</td>
                <td className="text-center font-semibold text-green-600">
                  ${site.cost}
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

export default SitesPage;
