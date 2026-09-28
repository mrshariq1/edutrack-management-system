import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ToastContainer } from '../common/ToastContainer';

export const Layout: React.FC = () => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F8FC] dark:bg-[#0B1321] text-[#172033] dark:text-slate-100 flex flex-col antialiased selection:bg-[#1769E0] selection:text-white">
      {/* Toast Notification Stack */}
      <ToastContainer />

      {/* Sidebar Navigation */}
      <Sidebar
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 overflow-x-hidden transition-all duration-300 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Navbar */}
        <Navbar onOpenMobileSidebar={() => setIsOpenMobile(true)} />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Quiet Professional Footer */}
        <footer className="border-t border-slate-200/80 dark:border-slate-800/80 px-6 py-4 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl w-full mx-auto">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">EduTrack MIS</span>
            <span>·</span>
            <span>Version 2.4-Enterprise</span>
            <span>·</span>
            <span>All local demo data persisted</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Cambridge Academic District</span>
            <span>·</span>
            <span>Status: Nominal</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
