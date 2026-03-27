import { useEffect, useState } from "react";
import { getAllTasks } from "../../api/taskApi";
import MainLayout from "../../layout/MainLayout";
import StatsCard from "../../components/dashboard/StatsCard";
import TaskTable from "../../components/task/TaskTable";
import ProgressChart from "../../components/dashboard/ProgressChart";

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getAllTasks().then((res) => setTasks(res.data));
  }, []);

  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.length - completed;

  const chartData = tasks.map((t) => ({
    name: t.title,
    progress: t.progress,
  }));

  return (
    <MainLayout>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <StatsCard title="Total Tasks" value={tasks.length} />
        <StatsCard title="Completed" value={completed} />
        <StatsCard title="Pending" value={pending} />
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 gap-6">
        <TaskTable tasks={tasks} />

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Progress Overview</h2>
          <ProgressChart data={chartData} />
        </div>
      </div>
    </MainLayout>
  );
}
