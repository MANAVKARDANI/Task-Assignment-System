import { Bell } from "lucide-react";

export default function NotificationBell({ unreadCount = 0 }) {
  return (
    <div className="relative cursor-pointer">
      <Bell className="text-slate-600" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 min-w-5 text-center bg-red-500 text-white text-[10px] px-1 rounded-full">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </div>
  );
}