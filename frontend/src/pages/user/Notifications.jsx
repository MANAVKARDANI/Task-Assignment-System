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
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="text-slate-500 text-sm mt-1">Your latest updates and history</p>
      </div>

      {loading ? (
        <div className="card p-6 text-slate-500">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-slate-100 animate-pulse" />
            ))}
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="card p-6 text-slate-500">No notifications.</div>
      ) : (
        <div className="card p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-slate-200 text-slate-500">
                <th className="py-2">Message</th>
                <th className="py-2">Task</th>
                <th className="py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {items.map((n) => (
                <tr
                  key={n.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
                    n.is_read ? "" : "bg-blue-50/50"
                  }`}
                  onClick={() => handleOpenTask(n)}
                >
                  <td className="py-3">
                    <div className="font-medium text-slate-900">{n.message}</div>
                  </td>
                  <td className="py-3 text-slate-600">{n.task_id ? `#${n.task_id}` : "-"}</td>
                  <td className="py-3 text-slate-500">
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MainLayout>
  );
}

