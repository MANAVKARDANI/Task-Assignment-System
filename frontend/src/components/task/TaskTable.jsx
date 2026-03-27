import { isOverdue } from "../../utils/dateUtils";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function TaskTable({ tasks }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString();
  };

  const formatStatusLabel = (s) => {
    if (!s) return "-";
    if (s === "in_progress") return "In Progress";
    if (s === "overdue") return "Overdue";
    if (s === "pending") return "Pending";
    if (s === "completed") return "Completed";
    return s;
  };

  return (
    <div className="card p-5">
      <h2 className="text-lg font-semibold mb-4 text-slate-800">Task List</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b text-slate-600">
              <th className="py-2">Task Name</th>
              <th>Assigned Date</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Progress</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((t) => {
              const overdue = isOverdue(t.deadline) && t.status !== "completed";
              const effectiveStatus = overdue ? "overdue" : t.status;
              const assignedAt = t.assign_date || t.createdAt;

              return (
                <tr
                  key={t.id}
                  onClick={() => {
                    if (!t.id) return;
                    if (user?.role === "admin") navigate(`/admin/tasks/${t.id}`);
                    else navigate(`/user/tasks/${t.id}`);
                  }}
                  className={`border-b hover:bg-gray-50 transition cursor-pointer ${
                    overdue ? "bg-red-50" : ""
                  }`}
                >
                  <td className="py-3 font-medium text-slate-900">{t.title}</td>
                  <td className="text-slate-600">{formatDate(assignedAt)}</td>
                  <td className="text-slate-600">{formatDate(t.deadline)}</td>
                  <td className="text-slate-600">{t.priority || "-"}</td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        effectiveStatus === "completed"
                          ? "bg-green-100 text-green-700"
                          : effectiveStatus === "overdue"
                            ? "bg-red-100 text-red-700"
                            : effectiveStatus === "in_progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {formatStatusLabel(effectiveStatus)}
                    </span>
                  </td>

                  {/* Progress */}
                  <td className="w-40">
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${t.progress}%` }}
                      />
                    </div>
                    <p className="text-xs mt-1">{t.progress}%</p>
                  </td>

                  <td className="text-right py-3">
                    <button
                      type="button"
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1 rounded-lg text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!t.id) return;
                        if (user?.role === "admin") navigate(`/admin/tasks/${t.id}`);
                        else navigate(`/user/tasks/${t.id}`);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty State */}
        {tasks.length === 0 && (
          <p className="text-center text-slate-400 py-6">No tasks available</p>
        )}
      </div>
    </div>
  );
}
