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

  const data = tasks.map((t) => ({
    name: t.title,
    progress: t.progress,
  }));

  return (
    <MainLayout>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatsCard title="Total Tasks" value={tasks.length} />
        <StatsCard title="Completed" value={tasks.filter(t => t.status === "completed").length} />
        <StatsCard title="Pending" value={tasks.filter(t => t.status !== "completed").length} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <TaskTable tasks={tasks} />
        <ProgressChart data={data} />
      </div>
    </MainLayout>
  );
}