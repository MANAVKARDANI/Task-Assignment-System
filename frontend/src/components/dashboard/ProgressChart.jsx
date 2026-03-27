import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ProgressChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" hide />
        <YAxis />
        <Tooltip />
        <Bar dataKey="progress" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}