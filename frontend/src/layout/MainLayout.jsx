import { useState, useCallback } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function MainLayout({ children }) {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleMainScroll = useCallback((e) => {
    setNavScrolled(e.currentTarget.scrollTop > 6);
  }, []);

  return (
    <div className="flex h-screen min-h-0 bg-white">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          navScrolled={navScrolled}
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
        />
        <div
          id="main-scroll"
          onScroll={handleMainScroll}
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
