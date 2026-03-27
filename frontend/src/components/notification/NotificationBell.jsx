import { Bell } from "lucide-react";

export default function NotificationBell({ unreadCount = 0 }) {
  return (
    <div className="relative">
      <Bell className="text-gray-600" size={20} strokeWidth={1.75} />
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full border border-white bg-gray-900 px-1 text-[10px] font-semibold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </div>
  );
}
