import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ProgressChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#6b7280" }}
          interval={0}
          angle={-20}
          dy={8}
        />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#6b7280" }} />
        <Tooltip
          contentStyle={{
            borderRadius: "0.75rem",
            border: "1px solid #e5e7eb",
            fontSize: "12px",
          }}
        />
        <Bar dataKey="progress" fill="#374151" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}