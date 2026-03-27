import { useEffect, useState } from "react";
import { getUsers } from "../../api/userApi";
import MainLayout from "../../layout/MainLayout";
import { UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers()
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-4 text-slate-900">Manage Users</h1>
      <div className="card p-4 overflow-x-auto">
        {loading ? (
          <p className="text-slate-500">Loading users...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Post</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-100 cursor-pointer hover:bg-slate-50"
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                >
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                        <UserRound size={14} />
                      </span>
                      <span className="font-medium text-slate-700">{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {user.Profile?.mobile || "-"}
                  </td>
                  <td>{user.Post?.name || "-"}</td>
                  <td>
                    <span className="rounded-full px-2 py-1 text-xs bg-slate-100 text-slate-700">
                      {user.status || "active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </MainLayout>
  );
}