export default function NotificationList({ data, onMarkRead, onOpenTask }) {
  return (
    <div className="card p-3 w-80 max-h-80 overflow-y-auto">
      <h3 className="font-semibold text-slate-800 mb-2">Notifications</h3>
      {data.length === 0 && (
        <p className="text-sm text-slate-500 py-3">No notifications yet.</p>
      )}
      {data.map((n) => (
        <button
          key={n.id}
          type="button"
          onClick={() => {
            if (typeof onOpenTask === "function" && n.task_id) {
              onOpenTask(n.task_id);
            }
            if (typeof onMarkRead === "function") {
              onMarkRead(n.id);
            }
          }}
          className={`w-full text-left border-b border-slate-100 py-2 px-1 rounded ${
            n.is_read ? "text-slate-500" : "text-slate-800 bg-blue-50/50"
          }`}
        >
          <p className="text-sm">{n.message}</p>
          <p className="text-xs text-slate-400 mt-1">
            {new Date(n.createdAt).toLocaleString()}
          </p>
        </button>
      ))}
    </div>
  );
}