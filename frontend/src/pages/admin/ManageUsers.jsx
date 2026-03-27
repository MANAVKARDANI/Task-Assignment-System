import { useEffect, useState } from "react";
import { getUsers } from "../../api/userApi";
import { createTask } from "../../api/taskApi";
import MainLayout from "../../layout/MainLayout";

export default function AssignTask() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    assigned_to: "",
    deadline: "",
    priority: "medium",
  });

  useEffect(() => {
    getUsers().then((res) => setUsers(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTask(form);
    alert("Task Assigned!");
  };

  return (
    <MainLayout>
      <h1 className="text-xl font-bold mb-4">Assign Task</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <input
          placeholder="Title"
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <select
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
        >
          <option>Select User</option>
          {users.map((u) => (
            <option value={u.id}>{u.name}</option>
          ))}
        </select>

        <input
          type="date"
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />

        <select
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Assign Task
        </button>
      </form>
    </MainLayout>
  );
}