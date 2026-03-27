import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../../layout/MainLayout";
import { getNotificationsLimited, markNotificationAsRead } from "../../api/notificationApi";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Notifications() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setLoading(true);
    getNotificationsLimited(1000)
      .then((res) => setItems(res.data || []))
      .catch(() => {
        toast.error("Failed to load notifications");
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleOpenTask = async (n) => {
    if (!n) return;
    try {
      if (!n.is_read) await markNotificationAsRead(n.id);
    } catch {}

    if (!n.task_id) return;
    if (user?.role === "admin") navigate(`/admin/tasks/${n.task_id}`);
    else navigate(`/user/tasks/${n.task_id}`);
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Your latest updates and history
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-lg bg-gray-100"
              />
            ))}
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
          No notifications.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/90 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {items.map((n) => (
                <tr
                  key={n.id}
                  className={`cursor-pointer border-b border-gray-100 transition hover:bg-gray-50 ${
                    n.is_read ? "" : "bg-gray-50/90"
                  }`}
                  onClick={() => handleOpenTask(n)}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{n.message}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {n.task_id ? `#${n.task_id}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

