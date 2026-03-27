import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  ClipboardList,
  Plus,
  UserRound,
  Briefcase,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

function NavItem({
  to,
  end,
  icon: Icon,
  label,
  collapsed,
  onNavigate,
}) {
  return (
    <NavLink
      to={to}
      end={end}
      title={collapsed ? label : undefined}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
          isActive
            ? "bg-gray-100 font-medium text-gray-900"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        } ${collapsed ? "justify-center px-2" : ""}`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-gray-900 transition-opacity duration-200 ${
              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
            }`}
          />
          <Icon size={18} className="shrink-0 text-gray-500" strokeWidth={1.75} />
          {!collapsed && (
            <span className="truncate">{label}</span>
          )}
          {collapsed && (
            <span className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-800 opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100">
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ mobileOpen = false, onMobileClose }) {
  const { user } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);

  const closeMobile = () => onMobileClose?.();

  return (
    <>
      <button
        type="button"
        aria-hidden
        className={`fixed inset-0 z-30 bg-gray-900/20 backdrop-blur-[1px] transition-opacity duration-200 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMobile}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-out lg:static lg:translate-x-0 ${
          collapsed ? "lg:w-[72px]" : "lg:w-64"
        } w-[min(280px,85vw)] max-w-[280px] ${
          mobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        }`}
      >
        <div
          className={`flex items-center justify-between gap-2 border-b border-gray-200 px-3 py-4 ${
            collapsed ? "lg:flex-col lg:py-3" : ""
          }`}
        >
          {!collapsed && (
            <div className="min-w-0 flex-1 pl-1">
              <h2 className="truncate text-base font-semibold tracking-tight text-gray-900">
                Task System
              </h2>
              <p className="truncate text-xs text-gray-500">Workspace</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 lg:flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeft size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <NavItem
            to={user?.role === "admin" ? "/admin" : "/user"}
            end
            icon={Home}
            label="Dashboard"
            collapsed={collapsed}
            onNavigate={closeMobile}
          />

          <NavItem
            to="/profile"
            icon={UserRound}
            label="Profile"
            collapsed={collapsed}
            onNavigate={closeMobile}
          />

          {user?.role === "admin" && (
            <>
              <NavItem
                to="/admin/assign"
                icon={Plus}
                label="Assign Task"
                collapsed={collapsed}
                onNavigate={closeMobile}
              />
              <NavItem
                to="/admin/tasks"
                icon={ClipboardList}
                label="All Tasks"
                collapsed={collapsed}
                onNavigate={closeMobile}
              />
              <NavItem
                to="/admin/posts"
                icon={Briefcase}
                label="Posts"
                collapsed={collapsed}
                onNavigate={closeMobile}
              />
              <NavItem
                to="/admin/users"
                icon={Users}
                label="Users"
                collapsed={collapsed}
                onNavigate={closeMobile}
              />
            </>
          )}

          {user?.role === "user" && (
            <NavItem
              to="/user/tasks"
              icon={ClipboardList}
              label="My Tasks"
              collapsed={collapsed}
              onNavigate={closeMobile}
            />
          )}
        </nav>
      </aside>
    </>
  );
}
