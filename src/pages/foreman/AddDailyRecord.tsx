import Header from "../../components/layout/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const AddDailyRecord = () => {
  const [searchParams] = useSearchParams();
  const workerId = searchParams.get("workerId");

  const [date, setDate] = useState("");
  const [hours, setHours] = useState<number | "">("");
  const [wageType, setWageType] = useState<"daily" | "hourly">("daily");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const today = new Date().toISOString().split("T")[0];
    if (!date || !hours) return setError("All fields are required.");
    if (date > today) return setError("Cannot enter future dates.");

    // Simulate submission
    setTimeout(() => {
      setSuccess(`Record added for worker ${workerId} on ${date}`);
      setDate("");
      setHours("");
      setWageType("daily");
    }, 500);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 bg-gray-100 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Add Daily Record</h1>

          <form
            className="bg-white p-6 rounded shadow-md w-full max-w-md"
            onSubmit={handleSubmit}
          >
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {success && <p className="text-green-500 mb-2">{success}</p>}

            <label className="block mb-2 font-semibold">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <label className="block mb-2 mt-4 font-semibold">
              Hours Worked
            </label>
            <Input
              type="number"
              value={hours}
              onChange={(e) =>
                setHours(e.target.value === "" ? "" : Number(e.target.value))
              }
            />

            <label className="block mb-2 mt-4 font-semibold">Wage Type</label>
            <select
              className="w-full border rounded px-3 py-2 mb-4"
              value={wageType}
              onChange={(e) =>
                setWageType(e.target.value as "daily" | "hourly")
              }
            >
              <option value="daily">Daily</option>
              <option value="hourly">Hourly</option>
            </select>

            <Button type="submit" className="w-full">
              Add Record
            </Button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddDailyRecord;
