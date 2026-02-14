import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SiteCostChartProps {
  data: number[]; // array of site costs per day/week
}

// Convert numeric array into objects for recharts
const formatData = (data: number[]) => data.map((value, idx) => ({ name: `Day ${idx + 1}`, value }));

const SiteCostChart = ({ data }: SiteCostChartProps) => {
  const chartData = formatData(data);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SiteCostChart;
