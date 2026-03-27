import { motion } from "framer-motion";

export default function StatsCard({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card p-5"
    >
      <h3 className="text-slate-500">{title}</h3>
      <p className="text-3xl font-bold text-blue-600">{value}</p>
    </motion.div>
  );
}