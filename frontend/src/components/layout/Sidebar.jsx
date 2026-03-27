import { NavLink } from "react-router-dom";
import { Home, Users, ClipboardList, Plus } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const { user } = useContext(AuthContext);

  return (
    <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-xl">
      <h2 className="text-2xl font-bold p-5 border-b border-blue-500">
        Task System
      </h2>

      <nav className="p-4 space-y-2">
        {/* COMMON */}
        <NavLink
          to={user?.role === "admin" ? "/admin" : "/user"}
          className="flex items-center gap-3 p-3 rounded hover:bg-blue-700"
        >
          <Home size={18} /> Dashboard
        </NavLink>

        {/* ADMIN ONLY */}
        {user?.role === "admin" && (
          <>
            <NavLink
              to="/admin/assign"
              className="flex items-center gap-3 p-3 rounded hover:bg-blue-700"
            >
              <Plus size={18} /> Assign Task
            </NavLink>

            <NavLink
              to="/admin/users"
              className="flex items-center gap-3 p-3 rounded hover:bg-blue-700"
            >
              <Users size={18} /> Users
            </NavLink>
          </>
        )}

        {/* USER ONLY */}
        {user?.role === "user" && (
          <NavLink
            to="/user"
            className="flex items-center gap-3 p-3 rounded hover:bg-blue-700"
          >
            <ClipboardList size={18} /> My Tasks
          </NavLink>
        )}
      </nav>
    </div>
  );
}
