import { useEffect, useMemo, useState } from "react";
import { getAllTasks } from "../../api/taskApi";
import MainLayout from "../../layout/MainLayout";
import TaskTable from "../../components/task/TaskTable";
import { useLocation } from "react-router-dom";

export default function AllTasks() {
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

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          All tasks
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Admin view of every assigned task
        </p>
      </div>
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
          Loading tasks…
        </div>
      ) : (
        <TaskTable tasks={tasks} />
      )}
    </MainLayout>
  );
}

