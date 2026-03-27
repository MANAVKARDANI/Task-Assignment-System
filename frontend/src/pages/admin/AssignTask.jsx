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
    if (!form.title.trim()) {
      toast.error("Please enter Task Title");
      return;
    }
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

    try {
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
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to assign task");
    }
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Assign task
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a task and assign it to a team member
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
      >
        <input
          placeholder="Title"
          className="input-saas"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="input-saas min-h-[100px] resize-y"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <select
          className="input-saas"
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
          className="input-saas"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />

        <input
          placeholder="Milestones/Keywords (comma separated)"
          className="input-saas"
          value={form.keywordsInput}
          onChange={(e) => setForm({ ...form, keywordsInput: e.target.value })}
        />

        <select
          className="input-saas"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button
          type="submit"
          className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
        >
          Assign task
        </button>
      </form>
    </MainLayout>
  );
}
