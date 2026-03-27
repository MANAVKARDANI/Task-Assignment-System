import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function ProgressChart({ data }) {
  return (
    <BarChart width={400} height={300} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="progress" fill="#2563eb" />
    </BarChart>
  );
}