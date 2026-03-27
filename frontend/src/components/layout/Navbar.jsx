import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import NotificationBell from "../notification/NotificationBell";
import NotificationList from "../notification/NotificationList";
import { getNotifications, markNotificationAsRead } from "../../api/notificationApi";
import { getAllTasks, getMyTasks } from "../../api/taskApi";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [taskSuggestions, setTaskSuggestions] = useState([]);
  const [suggestOpen, setSuggestOpen] = useState(false);

  // Navbar task search (debounced URL params).
  const sp = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [q, setQ] = useState(sp.get("q") || "");
  const [assignDate, setAssignDate] = useState(sp.get("assignDate") || "");
  const [dueDate, setDueDate] = useState(sp.get("dueDate") || "");

  useEffect(() => {
    const sp2 = new URLSearchParams(location.search);
    setQ(sp2.get("q") || "");
    setAssignDate(sp2.get("assignDate") || "");
    setDueDate(sp2.get("dueDate") || "");
  }, [location.search]);

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (assignDate) params.set("assignDate", assignDate);
      if (dueDate) params.set("dueDate", dueDate);
      const search = params.toString();
      navigate(
        {
          pathname: location.pathname,
          search: search ? `?${search}` : "",
        },
        { replace: true }
      );
    }, 500);
    return () => clearTimeout(t);
  }, [q, assignDate, dueDate, navigate, location.pathname]);

  // Suggestions dropdown (debounced).
  useEffect(() => {
    const t = setTimeout(async () => {
      const qTrim = q.trim();
      if (!user || !qTrim || qTrim.length < 2) {
        setTaskSuggestions([]);
        return;
      }
      try {
        const res =
          user?.role === "admin"
            ? await getAllTasks({ q: qTrim, limit: 5 })
            : await getMyTasks({ q: qTrim, limit: 5 });
        setTaskSuggestions(res.data || []);
      } catch {
        setTaskSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q, user]);

  useEffect(() => {
    if (!user) return;
    getNotifications()
      .then((res) => setNotifications(res.data))
      .catch(() => setNotifications([]));
  }, [user]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      // Ignore UI error state for notification click.
    }
  };

  const handleOpenTask = (taskId) => {
    if (user?.role === "admin") navigate(`/admin/tasks/${taskId}`);
    else navigate(`/user/tasks/${taskId}`);
    setOpenNotifications(false);
    setSuggestOpen(false);
  };

  return (
    <div className="bg-white/90 backdrop-blur border-b border-slate-200 px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold text-slate-700">
        Welcome, {user?.name}
      </h1>

      <div className="flex items-center gap-4 relative flex-1 justify-center">
        <div className="hidden lg:flex items-center gap-3">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setSuggestOpen(true)}
              onBlur={() => setTimeout(() => setSuggestOpen(false), 120)}
              placeholder={user?.role === "admin" ? "Search user/task..." : "Search tasks..."}
              className="w-64 p-2 border border-slate-200 rounded-lg text-sm bg-white"
            />
            {suggestOpen && taskSuggestions.length > 0 && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-lg z-30 overflow-hidden">
                {taskSuggestions.map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleOpenTask(t.id)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                  >
                    <div className="text-sm font-medium text-slate-900">{t.title}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Due: {t.deadline ? new Date(t.deadline).toLocaleDateString() : "-"}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <input
            type="date"
            value={assignDate}
            onChange={(e) => setAssignDate(e.target.value)}
            className="p-2 border border-slate-200 rounded-lg text-sm bg-white"
            aria-label="Assign date"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-2 border border-slate-200 rounded-lg text-sm bg-white"
            aria-label="Due date"
          />
        </div>
        <button type="button" onClick={() => setOpenNotifications((v) => !v)}>
          <NotificationBell unreadCount={unreadCount} />
        </button>
        {openNotifications && (
          <div className="absolute right-0 top-10 z-20">
            <div className="flex flex-col items-end">
              <NotificationList
                data={notifications}
                onMarkRead={handleMarkRead}
                onOpenTask={handleOpenTask}
              />
              <button
                type="button"
                className="mt-2 mr-1 text-xs text-blue-700 hover:text-blue-800 font-medium"
                onClick={() => {
                  setOpenNotifications(false);
                  navigate("/notifications");
                }}
              >
                View all notifications
              </button>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
