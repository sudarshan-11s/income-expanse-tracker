import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ExpenseChart({ data = [] }) {
  const COLORS = ["#6366F1", "#EF4444", "#22C55E", "#F59E0B"];

  return (
    <div className="bg-gray-800 p-5 rounded-xl">
      <h3 className="mb-3">Category Breakdown</h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="total" nameKey="_id" label>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}