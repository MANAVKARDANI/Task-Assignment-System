import { isOverdue } from "../../utils/dateUtils";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function TaskTable({ tasks, title }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString();
  };

  const formatStatusLabel = (s) => {
    if (!s) return "—";
    if (s === "in_progress") return "In Progress";
    if (s === "overdue") return "Overdue";
    if (s === "pending") return "Pending";
    if (s === "completed") return "Completed";
    return s;
  };

  const statusClass = (effectiveStatus) => {
    if (effectiveStatus === "completed")
      return "bg-gray-100 text-gray-800 ring-1 ring-gray-200/80";
    if (effectiveStatus === "overdue")
      return "bg-gray-200 text-gray-900 ring-1 ring-gray-300/80";
    if (effectiveStatus === "in_progress")
      return "bg-gray-50 text-gray-800 ring-1 ring-gray-200";
    return "bg-gray-100 text-gray-600 ring-1 ring-gray-200/80";
  };

  return (
    <div className="w-full">
      {title ? (
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-gray-900">
          {title}
        </h2>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50/95 backdrop-blur-sm">
              <tr className="text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                <th className="whitespace-nowrap px-4 py-3">Task Name</th>
                <th className="whitespace-nowrap px-4 py-3">Assigned</th>
                <th className="whitespace-nowrap px-4 py-3">Due Date</th>
                <th className="whitespace-nowrap px-4 py-3">Priority</th>
                <th className="whitespace-nowrap px-4 py-3">Status</th>
                <th className="min-w-[140px] whitespace-nowrap px-4 py-3">
                  Progress
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {tasks.map((t) => {
                const overdue = isOverdue(t.deadline) && t.status !== "completed";
                const effectiveStatus = overdue ? "overdue" : t.status;
                const assignedAt = t.assign_date || t.createdAt;

                return (
                  <tr
                    key={t.id}
                    onClick={() => {
                      if (!t.id) return;
                      if (user?.role === "admin")
                        navigate(`/admin/tasks/${t.id}`);
                      else navigate(`/user/tasks/${t.id}`);
                    }}
                    className={`cursor-pointer transition-colors duration-150 hover:bg-gray-50 ${
                      overdue ? "bg-gray-100/80" : ""
                    }`}
                  >
                    <td className="px-4 py-3.5 font-medium text-gray-900">
                      {t.title}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-gray-600">
                      {formatDate(assignedAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-gray-600">
                      {formatDate(t.deadline)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 capitalize text-gray-600">
                      {t.priority || "—"}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(
                          effectiveStatus,
                        )}`}
                      >
                        {formatStatusLabel(effectiveStatus)}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="w-full max-w-[140px]">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-gray-800 transition-all duration-300"
                            style={{ width: `${t.progress ?? 0}%` }}
                          />
                        </div>
                        <p className="mt-1 text-xs tabular-nums text-gray-500">
                          {t.progress ?? 0}%
                        </p>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 text-right">
                      <button
                        type="button"
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!t.id) return;
                          if (user?.role === "admin")
                            navigate(`/admin/tasks/${t.id}`);
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
        </div>

        {tasks.length === 0 && (
          <p className="border-t border-gray-100 px-4 py-10 text-center text-sm text-gray-500">
            No tasks available
          </p>
        )}
      </div>
    </div>
  );
}
