export default function ActivityFeed({ tasks }) {
  return (
    <div className="card p-4">
      <h3 className="font-semibold text-slate-800 mb-3">Recent Activity</h3>
      <div className="space-y-3">
        {tasks.slice(0, 6).map((task) => (
          <div key={task.id} className="border-l-2 border-blue-500 pl-3">
            <p className="text-sm font-medium text-slate-700">{task.title}</p>
            <p className="text-xs text-slate-500">
              Status: {task.status} - Progress: {task.progress}%
            </p>
          </div>
        ))}
        {tasks.length === 0 && <p className="text-sm text-slate-500">No recent activity.</p>}
      </div>
    </div>
  );
}
