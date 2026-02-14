interface Site {
  id: string;
  name: string;
  location: string;
  foreman: string;
  totalCost: number;
}

interface Props {
  sites: Site[];
}

const SitesTable = ({ sites }: Props) => {
  return (
    <table className="min-w-full bg-white rounded shadow">
      <thead className="bg-gray-200">
        <tr>
          <th className="px-4 py-2 text-left">Name</th>
          <th>Location</th>
          <th>Foreman</th>
          <th>Total Cost</th>
        </tr>
      </thead>
      <tbody>
        {sites.map((site) => (
          <tr key={site.id} className="border-b hover:bg-gray-50">
            <td className="px-4 py-2">{site.name}</td>
            <td>{site.location}</td>
            <td>{site.foreman}</td>
            <td>${site.totalCost}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SitesTable;
