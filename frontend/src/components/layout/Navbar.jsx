import { useContext, useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Menu } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import NotificationBell from "../notification/NotificationBell";
import NotificationList from "../notification/NotificationList";
import {
  getNotifications,
  markNotificationAsRead,
} from "../../api/notificationApi";
import { getAllTasks, getMyTasks } from "../../api/taskApi";

export default function Navbar({
  navScrolled = false,
  onOpenMobileMenu,
}) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [taskSuggestions, setTaskSuggestions] = useState([]);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const sp = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const [q, setQ] = useState(sp.get("q") || "");

  useEffect(() => {
    const sp2 = new URLSearchParams(location.search);
    setQ(sp2.get("q") || "");
  }, [location.search]);

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());

      navigate(
        {
          pathname: location.pathname,
          search: params.toString() ? `?${params}` : "",
        },
        { replace: true },
      );
    }, 300);
    return () => clearTimeout(t);
  }, [q, navigate, location.pathname]);

  useEffect(() => {
    const t = setTimeout(async () => {
      const qTrim = q.trim();
      if (!user || qTrim.length < 2) return setTaskSuggestions([]);

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

  useEffect(() => {
    const handleDown = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setOpenNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleDown);
    return () => document.removeEventListener("mousedown", handleDown);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications],
  );

  const normalizedQuery = useMemo(() => q.trim().toLowerCase(), [q]);

  const rankedSuggestions = useMemo(() => {
    if (!normalizedQuery) return [];
    const scoreTask = (t) => {
      const title = (t.title || "").toLowerCase();
      const userName = (t.User?.name || "").toLowerCase();
      const userRole = (t.User?.role || "").toLowerCase();
      const userEmail = (t.User?.email || "").toLowerCase();

      if (title.startsWith(normalizedQuery)) return 1;
      if (userName.startsWith(normalizedQuery)) return 2;
      if (userRole.startsWith(normalizedQuery)) return 3;
      if (title.includes(normalizedQuery)) return 4;
      if (userName.includes(normalizedQuery)) return 5;
      if (userRole.includes(normalizedQuery) || userEmail.includes(normalizedQuery))
        return 6;
      return 99;
    };

    return [...taskSuggestions]
      .filter((t) => {
        const title = (t.title || "").toLowerCase();
        const userName = (t.User?.name || "").toLowerCase();
        const userRole = (t.User?.role || "").toLowerCase();
        const userEmail = (t.User?.email || "").toLowerCase();
        return (
          title.includes(normalizedQuery) ||
          userName.includes(normalizedQuery) ||
          userRole.includes(normalizedQuery) ||
          userEmail.includes(normalizedQuery)
        );
      })
      .sort((a, b) => scoreTask(a) - scoreTask(b))
      .slice(0, 8);
  }, [taskSuggestions, normalizedQuery]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
    } catch {}
  };

  const handleOpenTask = (taskId) => {
    navigate(
      user?.role === "admin"
        ? `/admin/tasks/${taskId}`
        : `/user/tasks/${taskId}`,
    );
    setOpenNotifications(false);
    setSuggestOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm transition-all duration-300 ${
        navScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="flex h-14 items-center gap-3 px-4 sm:h-16 sm:px-6 lg:gap-6">
        <button
          type="button"
          onClick={() => onOpenMobileMenu?.()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        <div className="hidden min-w-0 sm:block lg:max-w-[200px]">
          <p className="truncate text-sm font-medium text-gray-900">
            {user?.name}
          </p>
          <p className="truncate text-xs text-gray-500">
            {user?.role === "admin" ? "Administrator" : "Member"}
          </p>
        </div>

        <div className="relative min-w-0 flex-1 max-w-xl mx-auto">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setSuggestOpen(true)}
            onBlur={() => setTimeout(() => setSuggestOpen(false), 150)}
            placeholder="Search task, user, role..."
            className="input-saas w-full pl-10 pr-3 py-2 text-sm"
          />

          {suggestOpen && rankedSuggestions.length > 0 && (
            <div className="absolute top-full z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-md">
              {rankedSuggestions.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleOpenTask(t.id)}
                  className="w-full px-4 py-2.5 text-left transition hover:bg-gray-50"
                >
                  <div className="text-sm font-medium text-gray-900">
                    {t.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {(t.User?.name || "Unknown user") +
                      (t.User?.role ? ` • ${t.User.role}` : "")}
                    {" • "}
                    {t.deadline ? new Date(t.deadline).toLocaleDateString() : "—"}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setOpenNotifications((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100"
              aria-expanded={openNotifications}
              aria-label="Notifications"
            >
              <NotificationBell unreadCount={unreadCount} />
            </button>

            {openNotifications && (
              <div className="absolute right-0 top-11 z-50 w-[min(100vw-2rem,20rem)] sm:w-80">
                <NotificationList
                  data={notifications}
                  onMarkRead={handleMarkRead}
                  onOpenTask={handleOpenTask}
                />
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full p-0.5 ring-2 ring-transparent transition hover:ring-gray-200"
              aria-expanded={profileOpen}
              aria-label="Account menu"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-11 z-50 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-md">
                <button
                  type="button"
                  onClick={() => {
                    navigate("/profile");
                    setProfileOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/profile");
                    setProfileOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  Settings
                </button>
                <div className="my-1 border-t border-gray-100" />
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setProfileOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-600 transition hover:bg-gray-50"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
