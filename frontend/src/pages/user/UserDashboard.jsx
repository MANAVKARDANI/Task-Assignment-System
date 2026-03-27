import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTasks } from "../../api/taskApi";
import MainLayout from "../../layout/MainLayout";
import TaskTable from "../../components/task/TaskTable";
import { useLocation } from "react-router-dom";
import { getNotifications, markNotificationAsRead } from "../../api/notificationApi";
import { Clock, CheckCircle2, AlertTriangle, ListChecks } from "lucide-react";

export default function UserDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    getMyTasks(params)
      .then((res) => setTasks(res.data))
      .finally(() => setLoading(false));
  }, [params]);

  useEffect(() => {
    setLoadingNotifications(true);
    getNotifications()
      .then((res) => setNotifications(res.data))
      .catch(() => setNotifications([]))
      .finally(() => setLoadingNotifications(false));
  }, []);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter(
    (t) => t.status === "pending" || t.status === "in_progress"
  ).length;
  const overdue = tasks.filter((t) => t.status === "overdue").length;

  const recentTasks = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sorted.slice(0, 5);
  }, [tasks]);

  const openTask = async (taskId, notificationId) => {
    if (notificationId) {
      try {
        await markNotificationAsRead(notificationId);
      } catch {}
    }
    if (!taskId) return;
    navigate(`/user/tasks/${taskId}`);
  };

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-4 text-slate-900">My Dashboard</h1>
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <div className="card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
            <ListChecks size={18} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Total Tasks</p>
            <p className="text-2xl font-bold text-slate-900">{total}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-green-700">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-600">{completed}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-700">
            <Clock size={18} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-700">{pending}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center text-red-700">
            <AlertTriangle size={18} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Overdue</p>
            <p className="text-2xl font-bold text-red-700">{overdue}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-800">Recent Tasks</h2>
              <button
                type="button"
                className="text-sm text-blue-700 hover:text-blue-800 font-medium"
                onClick={() => navigate("/user/tasks")}
              >
                View all
              </button>
            </div>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 rounded-lg bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : recentTasks.length ? (
              <div className="space-y-3">
                {recentTasks.map((t) => {
                  const badge =
                    t.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : t.status === "overdue"
                        ? "bg-red-100 text-red-700"
                        : t.status === "in_progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700";
                  const label =
                    t.status === "in_progress"
                      ? "In Progress"
                      : t.status === "overdue"
                        ? "Overdue"
                        : t.status === "pending"
                          ? "Pending"
                          : t.status === "completed"
                            ? "Completed"
                            : t.status;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => navigate(`/user/tasks/${t.id}`)}
                      className="w-full text-left border border-slate-200 hover:bg-slate-50 rounded-xl p-3 transition"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-medium text-slate-900">{t.title}</div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge}`}>
                          {label}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="text-sm text-slate-600">Due: {t.deadline ? new Date(t.deadline).toLocaleDateString() : "-"}</p>
                        <p className="text-sm font-medium text-slate-900">{t.progress}%</p>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full mt-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${t.progress}%` }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No tasks assigned.</p>
            )}
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-3">My Tasks</h2>
            {loading ? <p className="text-slate-500">Loading...</p> : <TaskTable tasks={tasks} />}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-800">Notifications</h2>
              <button
                type="button"
                className="text-sm text-blue-700 hover:text-blue-800 font-medium"
                onClick={() => navigate("/notifications")}
              >
                View all
              </button>
            </div>
            {loadingNotifications ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 rounded-lg bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : notifications.length ? (
              <div className="space-y-2">
                {notifications.slice(0, 3).map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => openTask(n.task_id, n.id)}
                    className="w-full text-left border border-slate-200 hover:bg-slate-50 rounded-xl p-3 transition"
                  >
                    <p className="text-sm font-medium text-slate-800">{n.message}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No notifications.</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}