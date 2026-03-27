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
    }, 300);

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
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          My tasks
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Search and filter your assigned work
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Search
            </label>
            <input
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              placeholder="Task name"
              className="input-saas"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Status
            </label>
            <select
              value={statusInput}
              onChange={(e) => setStatusInput(e.target.value)}
              className="input-saas"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Priority
            </label>
            <select
              value={priorityInput}
              onChange={(e) => setPriorityInput(e.target.value)}
              className="input-saas"
            >
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Due date
            </label>
            <input
              type="date"
              value={dueDateInput}
              onChange={(e) => setDueDateInput(e.target.value)}
              className="input-saas"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
            onClick={() => {
              setQInput("");
              setStatusInput("");
              setPriorityInput("");
              setDueDateInput("");
            }}
          >
            Reset filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded-lg bg-gray-100"
              />
            ))}
          </div>
        </div>
      ) : (
        <TaskTable tasks={tasks} />
      )}
    </MainLayout>
  );
}
