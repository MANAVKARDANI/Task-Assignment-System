export default function NotificationList({ data, onMarkRead, onOpenTask }) {
  return (
    <div className="max-h-80 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
      <div className="border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
        <p className="text-xs text-gray-500">Recent updates</p>
      </div>
      <div className="max-h-64 overflow-y-auto py-1">
        {data.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-gray-500">
            No notifications yet.
          </p>
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
            className={`w-full border-b border-gray-50 px-4 py-3 text-left transition last:border-0 hover:bg-gray-50 ${
              n.is_read ? "text-gray-600" : "bg-gray-50/80 text-gray-900"
            }`}
          >
            <p className="text-sm leading-snug">{n.message}</p>
            <p className="mt-1 text-xs text-gray-500">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
