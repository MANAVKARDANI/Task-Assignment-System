import { useEffect, useState } from "react";
import { getUsers } from "../../api/userApi";
import { createTask } from "../../api/taskApi";
import MainLayout from "../../layout/MainLayout";
import toast from "react-hot-toast";

export default function AssignTask() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    assigned_to: "",
    deadline: "",
    priority: "medium",
    keywordsInput: "",
  });

  useEffect(() => {
    getUsers()
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Failed to load users"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.assigned_to) {
      toast.error("Please select a user");
      return;
    }
    const keywords = form.keywordsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!keywords.length) {
      toast.error("Please add at least one milestone/keyword (comma separated)");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      assigned_to: Number(form.assigned_to),
      due_date: form.deadline,
      priority: form.priority,
      keywords,
    };

    await createTask(payload);
    toast.success("Task assigned successfully");
    setForm({
      title: "",
      description: "",
      assigned_to: "",
      deadline: "",
      priority: "medium",
      keywordsInput: "",
    });
  };

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-4 text-slate-900">Assign Task</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4 max-w-2xl">
        <input
          placeholder="Title"
          className="w-full p-2 border border-slate-200 rounded-lg"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="w-full p-2 border border-slate-200 rounded-lg"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <select
          className="w-full p-2 border border-slate-200 rounded-lg"
          value={form.assigned_to}
          onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>

        <input
          type="date"
          className="w-full p-2 border border-slate-200 rounded-lg"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />

        <input
          placeholder="Milestones/Keywords (comma separated)"
          className="w-full p-2 border border-slate-200 rounded-lg"
          value={form.keywordsInput}
          onChange={(e) => setForm({ ...form, keywordsInput: e.target.value })}
        />

        <select
          className="w-full p-2 border border-slate-200 rounded-lg"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Assign Task
        </button>
      </form>
    </MainLayout>
  );
}