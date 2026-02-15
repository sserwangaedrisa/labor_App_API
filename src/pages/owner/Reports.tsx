import OwnerLayout from "../../components/layout/OwnerLayout";

const ReportsPage = () => {
  return (
    <OwnerLayout>
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <p className="mb-4">
          Generate expense summaries and export financial data.
        </p>

        <div className="flex gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
            Export PDF
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow">
            Export Excel
          </button>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default ReportsPage;
