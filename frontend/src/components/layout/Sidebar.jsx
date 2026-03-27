import { NavLink } from "react-router-dom";
import { Home, Users, ClipboardList, Plus, UserRound, Briefcase } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const navClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition ${
      isActive ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <div className="w-64 bg-white border-r border-slate-200 shadow-sm">
      <h2 className="text-2xl font-bold p-5 border-b border-slate-200 text-blue-700">
        Task System
      </h2>

      <nav className="p-4 space-y-2">
        {/* COMMON */}
        <NavLink
          to={user?.role === "admin" ? "/admin" : "/user"}
          className={navClass}
        >
          <Home size={18} /> Dashboard
        </NavLink>

        <NavLink to="/profile" className={navClass}>
          <UserRound size={18} /> Profile
        </NavLink>

        {/* ADMIN ONLY */}
        {user?.role === "admin" && (
          <>
            <NavLink
              to="/admin/assign"
              className={navClass}
            >
              <Plus size={18} /> Assign Task
            </NavLink>

            <NavLink to="/admin/tasks" className={navClass}>
              <ClipboardList size={18} /> All Tasks
            </NavLink>

            <NavLink to="/admin/posts" className={navClass}>
              <Briefcase size={18} /> Posts
            </NavLink>

            <NavLink
              to="/admin/users"
              className={navClass}
            >
              <Users size={18} /> Users
            </NavLink>
          </>
        )}

        {/* USER ONLY */}
        {user?.role === "user" && (
          <NavLink
            to="/user/tasks"
            className={navClass}
          >
            <ClipboardList size={18} /> My Tasks
          </NavLink>
        )}
      </nav>
    </div>
  );
}
