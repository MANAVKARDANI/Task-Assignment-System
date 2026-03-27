import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Bell } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold text-gray-700">
        Welcome, {user?.name}
      </h1>

      <div className="flex items-center gap-4">
        <Bell className="cursor-pointer text-gray-600" />

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
