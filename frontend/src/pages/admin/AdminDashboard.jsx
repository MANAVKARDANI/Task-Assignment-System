import { useEffect, useMemo, useState } from "react";
import { getAllTasks } from "../../api/taskApi";
import MainLayout from "../../layout/MainLayout";
import StatsCard from "../../components/dashboard/StatsCard";
import TaskTable from "../../components/task/TaskTable";
import ProgressChart from "../../components/dashboard/ProgressChart";
import TaskPieChart from "../../components/dashboard/TaskPieChart";
import ActivityFeed from "../../components/dashboard/ActivityFeed";
import { useLocation } from "react-router-dom";

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const params = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const q = sp.get("q") || "";
    const assignDate = sp.get("assignDate") || "";
    const dueDate = sp.get("dueDate") || "";
    const out = {};
    if (q.trim()) out.q = q.trim();
    if (assignDate) out.assignDate = assignDate;
    if (dueDate) out.dueDate = dueDate;
    return out;
  }, [location.search]);

  useEffect(() => {
    getAllTasks(params)
      .then((res) => setTasks(res.data))
      .finally(() => setLoading(false));
  }, [params]);

  const completed = tasks.filter((t) => t.status === "completed").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const avgProgress = tasks.length
    ? Math.round(tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / tasks.length)
    : 0;

  const chartData = tasks.slice(0, 8).map((t) => ({
    name: t.title.length > 12 ? `${t.title.slice(0, 12)}...` : t.title,
    progress: t.progress,
  }));
  const pieData = [
    { name: "Pending", value: pending },
    { name: "In Progress", value: inProgress },
    { name: "Completed", value: completed },
  ];

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin Analytics Dashboard</h1>
        <p className="text-slate-500">Live insights based on PostgreSQL task records</p>
      </div>
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Tasks" value={tasks.length} />
        <StatsCard title="Completed" value={completed} />
        <StatsCard title="Pending" value={pending} />
        <StatsCard title="Avg Progress" value={`${avgProgress}%`} />
      </div>

      {loading ? (
        <div className="card p-6 text-slate-500">Loading analytics...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card p-4">
              <h2 className="font-semibold mb-3 text-slate-800">Task Progress Analysis</h2>
              <ProgressChart data={chartData} />
            </div>
            <div className="card p-4">
              <h2 className="font-semibold mb-3 text-slate-800">Status Distribution</h2>
              <TaskPieChart data={pieData} />
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TaskTable tasks={tasks} />
            </div>
            <ActivityFeed tasks={tasks} />
          </div>
        </div>
      )}
    </MainLayout>
  );
}
