export default function ActivityFeed({ tasks }) {
  return (
    <div>
      <h3 className="mb-3 text-base font-semibold text-gray-900">
        Recent activity
      </h3>
      <div className="space-y-3">
        {tasks.slice(0, 6).map((task) => (
          <div
            key={task.id}
            className="border-l-2 border-gray-300 pl-3 transition hover:border-gray-400"
          >
            <p className="text-sm font-medium text-gray-800">{task.title}</p>
            <p className="text-xs text-gray-500">
              Status: {task.status} · Progress: {task.progress}%
            </p>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-gray-500">No recent activity.</p>
        )}
      </div>
    </div>
  );
}
