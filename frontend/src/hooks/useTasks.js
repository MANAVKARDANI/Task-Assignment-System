import { useEffect, useState } from "react";
import { getMyTasks } from "../api/taskApi";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getMyTasks().then((res) => setTasks(res.data));
  }, []);

  return tasks;
}