import { useCallback, useEffect, useState } from "react";
import { getUsers } from "../../api/userApi";
import MainLayout from "../../layout/MainLayout";
import { UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = useCallback(() => {
    setLoading(true);
    getUsers()
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onUsers = () => load();
    window.addEventListener("users:changed", onUsers);
    return () => window.removeEventListener("users:changed", onUsers);
  }, [load]);

  return (
    <MainLayout>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Manage users
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of team members and roles
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/admin/add-user")}
          className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
        >
          Add user
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
        {loading ? (
          <p className="p-6 text-sm text-gray-500">Loading users…</p>
        ) : (
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/90 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Post</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="cursor-pointer border-b border-gray-100 transition hover:bg-gray-50"
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-gray-700">
                        <UserRound size={14} />
                      </span>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {user.Profile?.mobile || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {user.Post?.name || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200/80">
                      {user.status || "active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        </div>
      </div>
    </MainLayout>
  );
}