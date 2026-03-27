import { Bell } from "lucide-react";

export default function NotificationBell() {
  return (
    <div className="relative cursor-pointer">
      <Bell />
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
        3
      </span>
    </div>
  );
}