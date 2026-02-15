import OwnerLayout from "../../components/layout/OwnerLayout";

const SettingsPage = () => {
  return (
    <OwnerLayout>
      <h1 className="text-3xl font-bold mb-6">System Settings</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-4 max-w-md">
        <div>
          <label className="block font-semibold mb-1">
            Overtime Rate (%)
          </label>
          <input
            type="number"
            defaultValue={150}
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Max Daily Hours
          </label>
          <input
            type="number"
            defaultValue={8}
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
          Save Settings
        </button>
      </div>
    </OwnerLayout>
  );
};

export default SettingsPage;
