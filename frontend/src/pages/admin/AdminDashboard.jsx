import { useEffect, useMemo, useState } from "react";
import { getAllTasks } from "../../api/taskApi";
import MainLayout from "../../layout/MainLayout";
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
    const out = {};
    if (sp.get("q")) out.q = sp.get("q");
    if (sp.get("assignDate")) out.assignDate = sp.get("assignDate");
    if (sp.get("dueDate")) out.dueDate = sp.get("dueDate");
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
    ? Math.round(
        tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / tasks.length,
      )
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
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Admin dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of tasks and performance
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Tasks", value: tasks.length },
          { label: "Completed", value: completed },
          { label: "In Progress", value: inProgress },
          { label: "Avg Progress", value: `${avgProgress}%` },
        ].map((item, i) => (
          <div
            key={i}
            className="card-hover rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {item.label}
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-gray-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-sm text-gray-500 shadow-sm">
          Loading analytics…
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card-hover rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-gray-900">
                Task progress
              </h2>
              <ProgressChart data={chartData} />
            </div>

            <div className="card-hover rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-gray-900">
                Status distribution
              </h2>
              <TaskPieChart data={pieData} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="card-hover rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
              <TaskTable tasks={tasks} title="Task overview" />
            </div>

            <div className="card-hover rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <ActivityFeed tasks={tasks} />
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
