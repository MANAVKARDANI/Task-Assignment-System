import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getMyTasks } from "../../api/taskApi";
import MainLayout from "../../layout/MainLayout";
import TaskTable from "../../components/task/TaskTable";
import {
  getNotifications,
  markNotificationAsRead,
} from "../../api/notificationApi";
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
    (t) => t.status === "pending" || t.status === "in_progress",
  ).length;
  const overdue = tasks.filter((t) => t.status === "overdue").length;

  const recentTasks = useMemo(() => {
    const sorted = [...tasks].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
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
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your tasks and activity
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Tasks", value: total, icon: ListChecks },
          { label: "Completed", value: completed, icon: CheckCircle2 },
          { label: "Pending", value: pending, icon: Clock },
          { label: "Overdue", value: overdue, icon: AlertTriangle },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="card-hover flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-100 bg-gray-50">
                <Icon size={18} className="text-gray-600" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {item.label}
                </p>
                <p className="mt-0.5 text-2xl font-semibold tabular-nums text-gray-900">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card-hover rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-gray-900">
                Recent tasks
              </h2>
              <button
                type="button"
                onClick={() => navigate("/user/tasks")}
                className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
              >
                View all
              </button>
            </div>

            {loading ? (
              <p className="text-sm text-gray-500">Loading…</p>
            ) : recentTasks.length ? (
              <div className="space-y-2">
                {recentTasks.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => navigate(`/user/tasks/${t.id}`)}
                    className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-gray-300 hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-medium text-gray-900">{t.title}</p>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                        {t.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Due{" "}
                      {t.deadline
                        ? new Date(t.deadline).toLocaleDateString()
                        : "—"}
                    </p>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gray-800 transition-all"
                        style={{ width: `${t.progress ?? 0}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No tasks assigned.</p>
            )}
          </div>

          <div className="card-hover rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-gray-900">
              My tasks
            </h2>
            {loading ? (
              <p className="text-sm text-gray-500">Loading…</p>
            ) : (
              <TaskTable tasks={tasks} />
            )}
          </div>
        </div>

        <div>
          <div className="card-hover rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-gray-900">
                Notifications
              </h2>
              <button
                type="button"
                onClick={() => navigate("/notifications")}
                className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
              >
                View all
              </button>
            </div>

            {loadingNotifications ? (
              <p className="text-sm text-gray-500">Loading…</p>
            ) : notifications.length ? (
              <div className="space-y-2">
                {notifications.slice(0, 3).map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => openTask(n.task_id, n.id)}
                    className="w-full rounded-xl border border-gray-200 p-3 text-left transition hover:bg-gray-50"
                  >
                    <p className="text-sm text-gray-900">{n.message}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No notifications.</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
