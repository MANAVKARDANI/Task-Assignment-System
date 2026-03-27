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
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">All Tasks</h1>
        <p className="text-slate-500 text-sm mt-1">Admin view of every assigned task</p>
      </div>
      {loading ? (
        <div className="card p-6 text-slate-500">Loading tasks...</div>
      ) : (
        <TaskTable tasks={tasks} />
      )}
    </MainLayout>
  );
}

