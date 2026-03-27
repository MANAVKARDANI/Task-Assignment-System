import { useEffect, useMemo, useState } from "react";
import { getMyTasks } from "../../api/taskApi";
import MainLayout from "../../layout/MainLayout";
import TaskTable from "../../components/task/TaskTable";
import { useLocation, useNavigate } from "react-router-dom";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const assignDateExisting = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return sp.get("assignDate") || "";
  }, [location.search]);

  const params = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const q = sp.get("q") || "";
    const assignDate = sp.get("assignDate") || "";
    const dueDate = sp.get("dueDate") || "";
    const status = sp.get("status") || "";
    const priority = sp.get("priority") || "";
    const out = {};
    if (q.trim()) out.q = q.trim();
    if (assignDate) out.assignDate = assignDate;
    if (dueDate) out.dueDate = dueDate;
    if (status) out.status = status;
    if (priority) out.priority = priority;
    return out;
  }, [location.search]);

  const [qInput, setQInput] = useState(params.q || "");
  const [statusInput, setStatusInput] = useState(params.status || "");
  const [priorityInput, setPriorityInput] = useState(params.priority || "");
  const [dueDateInput, setDueDateInput] = useState(params.dueDate || "");

  useEffect(() => {
    setQInput(params.q || "");
    setStatusInput(params.status || "");
    setPriorityInput(params.priority || "");
    setDueDateInput(params.dueDate || "");
  }, [params.q, params.status, params.priority, params.dueDate]);

  // Debounced URL param updates for live search UX.
  useEffect(() => {
    const t = setTimeout(() => {
      const sp = new URLSearchParams();
      if (qInput.trim()) sp.set("q", qInput.trim());
      if (assignDateExisting) sp.set("assignDate", assignDateExisting);
      if (dueDateInput) sp.set("dueDate", dueDateInput);
      if (statusInput) sp.set("status", statusInput);
      if (priorityInput) sp.set("priority", priorityInput);

      navigate(
        {
          pathname: location.pathname,
          search: sp.toString() ? `?${sp.toString()}` : "",
        },
        { replace: true }
      );
    }, 500);

    return () => clearTimeout(t);
  }, [
    qInput,
    statusInput,
    priorityInput,
    dueDateInput,
    assignDateExisting,
    navigate,
    location.pathname,
  ]);

  useEffect(() => {
    getMyTasks(params)
      .then((res) => setTasks(res.data))
      .finally(() => setLoading(false));
  }, [params]);

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-4 text-slate-900">My Tasks</h1>

      <div className="card p-4 mb-5">
        <div className="grid md:grid-cols-4 gap-3">
          <div>
            <label className="text-sm text-slate-600 font-medium">Search</label>
            <input
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              placeholder="Task name"
              className="w-full p-2 mt-1 border border-slate-200 rounded-lg bg-white"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600 font-medium">Status</label>
            <select
              value={statusInput}
              onChange={(e) => setStatusInput(e.target.value)}
              className="w-full p-2 mt-1 border border-slate-200 rounded-lg bg-white"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-600 font-medium">Priority</label>
            <select
              value={priorityInput}
              onChange={(e) => setPriorityInput(e.target.value)}
              className="w-full p-2 mt-1 border border-slate-200 rounded-lg bg-white"
            >
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-600 font-medium">Due Date</label>
            <input
              type="date"
              value={dueDateInput}
              onChange={(e) => setDueDateInput(e.target.value)}
              className="w-full p-2 mt-1 border border-slate-200 rounded-lg bg-white"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="button"
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg text-sm"
            onClick={() => {
              setQInput("");
              setStatusInput("");
              setPriorityInput("");
              setDueDateInput("");
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card p-6 text-slate-500">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-slate-100 animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <TaskTable tasks={tasks} />
      )}
    </MainLayout>
  );
}
