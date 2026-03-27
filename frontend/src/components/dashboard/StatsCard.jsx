import { motion } from "framer-motion";

export default function StatsCard({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-5 rounded-2xl shadow"
    >
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-blue-600">{value}</p>
    </motion.div>
  );
}