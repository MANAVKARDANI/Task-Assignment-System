import { NavLink } from "react-router-dom";
import { Home, Users, ClipboardList } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg">
      <h2 className="text-xl font-bold p-4 border-b">
        Task System
      </h2>

      <nav className="p-4 space-y-2">
        <NavLink to="/admin" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          <Home size={18} /> Dashboard
        </NavLink>

        <NavLink to="/admin/tasks" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          <ClipboardList size={18} /> Tasks
        </NavLink>

        <NavLink to="/admin/users" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          <Users size={18} /> Users
        </NavLink>
      </nav>
    </div>
  );
}