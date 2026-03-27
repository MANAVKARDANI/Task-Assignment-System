import { useEffect, useState } from "react";
import { getMyTasks } from "../../api/taskApi";
import MainLayout from "../../layout/MainLayout";

export default function UserDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getMyTasks().then((res) => setTasks(res.data));
  }, []);

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

      <div className="grid gap-4">
        {tasks.map((t) => (
          <div className="bg-white p-4 rounded-xl shadow">
            <h2>{t.title}</h2>
            <p>Status: {t.status}</p>
            <p>Progress: {t.progress}%</p>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}