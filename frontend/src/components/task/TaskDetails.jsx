export default function TaskDetails({ task, onClose }) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96">
        <h2 className="text-xl font-bold mb-3">{task.title}</h2>
        <p className="text-gray-500 mb-2">{task.description}</p>

        <p>Status: {task.status}</p>
        <p>Progress: {task.progress}%</p>

        <button
          onClick={onClose}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}