import { isOverdue } from "../../utils/dateUtils";

export default function TaskTable({ tasks }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <h2 className="text-lg font-semibold mb-4">Task List</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b text-gray-600">
              <th className="py-2">Title</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Deadline</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((t) => {
              const overdue = isOverdue(t.deadline) && t.status !== "completed";

              return (
                <tr
                  key={t.id}
                  className={`border-b hover:bg-gray-50 transition ${
                    overdue ? "bg-red-50" : ""
                  }`}
                >
                  {/* Title */}
                  <td className="py-3 font-medium">{t.title}</td>

                  {/* Status */}
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        t.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : t.status === "in_progress"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {t.status}
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

                  {/* Deadline */}
                  <td>
                    <div className="flex flex-col">
                      <span>{new Date(t.deadline).toLocaleDateString()}</span>

                      {overdue && (
                        <span className="text-red-500 text-xs font-semibold">
                          Overdue
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty State */}
        {tasks.length === 0 && (
          <p className="text-center text-gray-400 py-6">No tasks available</p>
        )}
      </div>
    </div>
  );
}
