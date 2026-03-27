import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import MainLayout from "../../layout/MainLayout";
import { addComment } from "../../api/commentApi";
import { getUsers } from "../../api/userApi";
import {
  getTaskById,
  updateTask,
  updateTaskProgress,
} from "../../api/taskApi";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const MILESTONE_PIE_COLORS = ["#374151", "#d1d5db"];

function StatusBadge({ status }) {
  const badge = useMemo(() => {
    if (status === "completed") {
      return "bg-green-100 text-green-700";
    }
    if (status === "in_progress") {
      return "bg-yellow-100 text-yellow-700";
    }
    if (status === "overdue") {
      return "bg-red-100 text-red-700";
    }
    return "bg-slate-200 text-slate-700";
  }, [status]);

  const label = status === "overdue" ? "Overdue" : status?.replace("_", " ");
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge}`}>{label}</span>;
}

export default function TaskDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const [commentText, setCommentText] = useState("");

  // Progress UI (user)
  const [selectedKeywords, setSelectedKeywords] = useState({});

  // Admin UI
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "medium",
    status: "pending",
    assigned_to: "",
  });

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await getTaskById(id);
      setTask(res.data);

      const map = {};
      for (const k of res.data.keywords || []) {
        map[k.keyword] = Boolean(k.is_completed);
      }
      setSelectedKeywords(map);

      setEditForm({
        title: res.data.title || "",
        description: res.data.description || "",
        due_date: res.data.deadline ? res.data.deadline.slice(0, 10) : "",
        priority: res.data.priority || "medium",
        status:
          res.data.status === "overdue"
            ? "pending"
            : res.data.status || "pending",
        assigned_to: res.data.assigned_to ?? "",
      });
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  const notifyTasksChanged = () => {
    try {
      window.dispatchEvent(new CustomEvent("tasks:changed"));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (user?.role === "admin" && !users.length) {
      getUsers()
        .then((res) => setUsers(res.data))
        .catch(() => toast.error("Failed to load users for reassignment"));
    }
  }, [user, users.length]);

  const milestonePieData = useMemo(() => {
    const kws = task?.keywords || [];
    if (!kws.length) return [];
    const done = kws.filter((k) => k.is_completed).length;
    const left = kws.length - done;
    return [
      { name: "Completed", value: done },
      { name: "Remaining", value: left },
    ];
  }, [task]);

  const isAdmin = user?.role === "admin";
  const isOverdue = task?.status === "overdue";

  const handleUpdateProgress = async () => {
    const completedKeywords = Object.entries(selectedKeywords)
      .filter(([, v]) => v)
      .map(([k]) => k);

    if (!completedKeywords.length) {
      toast.error("Select at least one completed keyword");
      return;
    }

    try {
      await updateTaskProgress(id, completedKeywords);
      toast.success("Progress updated");
      await refresh();
      notifyTasksChanged();
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to update progress");
    }
  };

  const handleAdminSave = async (e) => {
    e.preventDefault();
    try {
      await updateTask(id, {
        title: editForm.title,
        description: editForm.description,
        due_date: editForm.due_date,
        priority: editForm.priority,
        status: editForm.status,
        assigned_to: Number(editForm.assigned_to),
      });
      toast.success("Task updated");
      setEditMode(false);
      await refresh();
      notifyTasksChanged();
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to update task");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error("Write a comment first");
      return;
    }
    try {
      await addComment(Number(id), commentText.trim());
      setCommentText("");
      toast.success("Comment added");
      await refresh();
      notifyTasksChanged();
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to add comment");
    }
  };

  return (
    <MainLayout>
      {loading ? (
        <div className="card p-6 text-slate-500">Loading task...</div>
      ) : !task ? (
        <div className="card p-6 text-slate-500">Task not found</div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{task.title}</h1>
              <p className="text-slate-600 mt-2">{task.description}</p>
            </div>
            <div className="text-right">
              <StatusBadge status={task.status} />
              <p className="text-sm text-slate-500 mt-2">
                Progress: <span className="font-semibold text-slate-800">{task.progress}%</span>
              </p>
            </div>
          </div>

              {isOverdue && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-700">Warning: This task is overdue.</p>
                  <p className="text-sm text-red-700/90 mt-1">
                    Due date has passed and the task is not completed.
                  </p>
                </div>
              )}

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="card p-5 lg:col-span-1">
              <h2 className="font-semibold text-slate-800 mb-3">Timeline</h2>
              <p className="text-sm text-slate-600">
                Assigned:{" "}
                <span className="font-medium text-slate-800">
                      {task.assign_date ? new Date(task.assign_date).toLocaleDateString() : new Date(task.createdAt).toLocaleDateString()}
                </span>
              </p>
              <p className="text-sm text-slate-600 mt-2">
                Due:{" "}
                <span className="font-medium text-slate-800">
                  {task.deadline ? new Date(task.deadline).toLocaleDateString() : "-"}
                </span>
              </p>
                  <p className="text-sm text-slate-600 mt-2">
                    Priority:{" "}
                    <span className="font-medium text-slate-800">
                      {task.priority || "-"}
                    </span>
                  </p>
              <div className="mt-4">
                <p className="text-sm text-slate-500">Assigned To</p>
                <p className="font-medium text-slate-800">
                  {task.User?.name || "-"}{" "}
                  <span className="text-xs text-slate-500">({task.User?.email || ""})</span>
                </p>
              </div>
            </div>

            <div className="card p-5 lg:col-span-2">
              <h2 className="font-semibold text-slate-800 mb-1">
                Milestone progress
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                {task.keywords?.length
                  ? `${task.keywords.filter((k) => k.is_completed).length} of ${task.keywords.length} milestones completed`
                  : "No milestones on this task."}
              </p>

              {task.keywords?.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="h-64 w-full min-h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={milestonePieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={52}
                          outerRadius={84}
                          paddingAngle={2}
                          stroke="#f8fafc"
                          strokeWidth={2}
                        >
                          {milestonePieData.map((entry, i) => (
                            <Cell
                              key={entry.name}
                              fill={MILESTONE_PIE_COLORS[i % MILESTONE_PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value} milestone(s)`, ""]}
                          contentStyle={{
                            borderRadius: "0.75rem",
                            border: "1px solid #e5e7eb",
                            fontSize: "12px",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                    {task.keywords.map((k) => (
                      <div key={k.id}>
                        <div className="mb-1 flex justify-between gap-2 text-xs">
                          <span
                            className="truncate font-medium text-slate-800"
                            title={k.keyword}
                          >
                            {k.keyword}
                          </span>
                          <span className="shrink-0 text-slate-500">
                            {k.is_completed ? "Done" : "Pending"}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              k.is_completed ? "bg-gray-900" : "bg-slate-300"
                            }`}
                            style={{ width: k.is_completed ? "100%" : "10%" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-6 border-t border-slate-100 pt-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Overall progress
                </p>
                <div className="h-2 w-full rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-gray-900 transition-all"
                    style={{ width: `${task.progress ?? 0}%` }}
                  />
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">
                    {task.progress ?? 0}%
                  </span>{" "}
                  based on milestones
                </p>
              </div>
            </div>
          </div>

          {/* User keyword completion */}
          {task.keywords?.length > 0 && !isAdmin && (
            <div className="card p-5">
              <div className="flex items-center justify-between gap-4 mb-3">
                <h2 className="font-semibold text-slate-800">Mark Keywords Completed</h2>
                <button
                  type="button"
                  onClick={handleUpdateProgress}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Update Progress
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {task.keywords.map((k) => (
                  <label key={k.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg">
                    <input
                      type="checkbox"
                      checked={Boolean(selectedKeywords[k.keyword])}
                      onChange={(e) =>
                        setSelectedKeywords((prev) => ({
                          ...prev,
                          [k.keyword]: e.target.checked,
                        }))
                      }
                    />
                    <span className="text-slate-800 text-sm">{k.keyword}</span>
                    <span className="ml-auto text-xs text-slate-500">
                      {k.is_completed ? "Done" : "Pending"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Admin edit */}
          {isAdmin && (
            <div className="card p-5">
              <div className="flex items-center justify-between gap-4 mb-3">
                <h2 className="font-semibold text-slate-800">Admin Controls</h2>
                <button
                  type="button"
                  onClick={() => setEditMode((v) => !v)}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm"
                >
                  {editMode ? "Cancel" : "Edit Task"}
                </button>
              </div>

              {!editMode ? (
                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-slate-500">Priority</p>
                    <p className="font-semibold text-slate-800">{task.priority || "-"}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-slate-500">Due Date</p>
                    <p className="font-semibold text-slate-800">
                      {task.deadline ? new Date(task.deadline).toLocaleDateString() : "-"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-slate-500">Assigned To</p>
                    <p className="font-semibold text-slate-800">{task.User?.name || "-"}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAdminSave} className="space-y-4">
                  <input
                    className="w-full p-2 border border-slate-200 rounded-lg"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Task Title"
                  />
                  <textarea
                    className="w-full p-2 border border-slate-200 rounded-lg"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Description"
                  />
                  <div className="grid md:grid-cols-2 gap-3">
                    <input
                      type="date"
                      className="w-full p-2 border border-slate-200 rounded-lg"
                      value={editForm.due_date}
                      onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                    />
                    <select
                      className="w-full p-2 border border-slate-200 rounded-lg"
                      value={editForm.priority}
                      onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <select
                      className="w-full p-2 border border-slate-200 rounded-lg"
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <select
                      className="w-full p-2 border border-slate-200 rounded-lg"
                      value={editForm.assigned_to}
                      onChange={(e) => setEditForm({ ...editForm, assigned_to: e.target.value })}
                    >
                      <option value="">Reassign To</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg text-sm"
                    >
                      Close
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Comments */}
          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-3">Comments</h2>

            <form onSubmit={handleAddComment} className="space-y-3 mb-5">
              <textarea
                className="w-full p-2 border border-slate-200 rounded-lg"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                type="submit"
                className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm"
              >
                Add Comment
              </button>
            </form>

            {task.comments?.length ? (
              <div className="space-y-4">
                {task.comments.map((c) => (
                  <div key={c.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-800">
                        {c.User?.name || "User"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                      </p>
                    </div>
                    <p className="text-slate-700 mt-2 text-sm">{c.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No comments yet.</p>
            )}
          </div>

          {/* Activity timeline */}
          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-3">Activity Timeline</h2>
            {task.activityTimeline && task.activityTimeline.length > 0 ? (
              <div className="space-y-3">
                {task.activityTimeline.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div
                      className={`mt-1 h-3 w-3 rounded-full ${
                        item.type === "assigned"
                          ? "bg-gray-900"
                          : item.type === "progress"
                            ? "bg-green-600"
                            : item.type === "comment"
                              ? "bg-slate-600"
                              : item.type === "reassigned"
                                ? "bg-amber-500"
                                : "bg-slate-400"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                      <p className="text-sm text-slate-600">{item.description}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No activity yet.</p>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
}

