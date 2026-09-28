import React from 'react';
import { NavLink } from 'react-router-dom';
import { useEduTrack } from '../../context/EduTrackContext';
import { SafeAvatar } from '../common/SafeAvatar';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  BookOpen,
  CalendarCheck,
  FileSpreadsheet,
  Award,
  CreditCard,
  UserCheck,
  Clock,
  Megaphone,
  BarChart3,
  Settings,
  ChevronLeft,
  X,
  School,
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { students, notices, fees, settings, adminUser } = useEduTrack();

  const overdueFeesCount = fees.filter(f => f.status === 'Overdue').length;
  const activeStudentsCount = students.filter(s => s.status === 'Active').length;
  const activeNoticesCount = notices.filter(n => n.isPublished).length;

  const navSections = [
    {
      title: 'CORE PLATFORM',
      items: [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
      ],
    },
    {
      title: 'ACADEMICS & STUDENTS',
      items: [
        { label: 'Students', path: '/students', icon: Users, badge: activeStudentsCount.toString() },
        { label: 'Teachers', path: '/teachers', icon: GraduationCap },
        { label: 'Classes', path: '/classes', icon: Layers },
        { label: 'Subjects', path: '/subjects', icon: BookOpen },
        { label: 'Attendance', path: '/attendance', icon: CalendarCheck },
        { label: 'Exams', path: '/exams', icon: FileSpreadsheet },
        { label: 'Grades', path: '/grades', icon: Award },
        { label: 'Timetable', path: '/timetable', icon: Clock },
      ],
    },
    {
      title: 'ADMINISTRATION & BURSAR',
      items: [
        { label: 'Fees & Billing', path: '/fees', icon: CreditCard, badge: overdueFeesCount > 0 ? `${overdueFeesCount} due` : undefined, badgeColor: 'amber' },
        { label: 'Parents', path: '/parents', icon: UserCheck },
        { label: 'Notices', path: '/notices', icon: Megaphone, badge: activeNoticesCount > 0 ? activeNoticesCount.toString() : undefined },
        { label: 'MIS Reports', path: '/reports', icon: BarChart3 },
      ],
    },
    {
      title: 'SYSTEM CONFIG',
      items: [
        { label: 'Settings', path: '/settings', icon: Settings },
      ],
    },
  ];

  const content = (
    <div className="flex h-full flex-col bg-[#0F2747] text-slate-300 border-r border-[#1B3A63] select-none">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-[#1B3A63] shrink-0 bg-[#0A1D36]/80 backdrop-blur-md">
        <NavLink
          to="/"
          onClick={onCloseMobile}
          className="flex items-center gap-3 overflow-hidden group text-left"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1769E0] text-white font-bold shadow-md shadow-blue-900/50 group-hover:scale-105 transition-transform">
            <School className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white font-sans">
                  EduTrack
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-400/15 text-blue-300 border border-blue-400/25">
                  MIS
                </span>
              </div>
              <span className="text-[11px] text-slate-300/80 font-medium truncate">
                {settings.institutionName || 'Oakridge Academy'}
              </span>
            </div>
          )}
        </NavLink>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close navigation menu"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Desktop collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform duration-200 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-blue-200/60 font-mono">
                {section.title}
              </div>
            )}
            {isCollapsed && (
              <div className="text-center text-[10px] text-blue-300/40 font-bold mb-1">
                •
              </div>
            )}

            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                      isActive
                        ? 'bg-[#1769E0] text-white shadow-sm shadow-blue-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
                  {!isCollapsed && (
                    <span className="truncate flex-1 tracking-tight">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-bold shrink-0 ${
                        item.badgeColor === 'amber'
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : 'bg-white/15 text-white border border-white/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Tooltip on collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 hidden rounded-lg bg-[#0F2747] border border-[#1B3A63] px-3 py-1.5 text-xs font-medium text-white shadow-xl group-hover:block z-50 whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Profile Summary Card */}
      <div className="border-t border-[#1B3A63] p-3 shrink-0 bg-[#0A1D36]/60">
        <NavLink
          to="/profile"
          onClick={onCloseMobile}
          className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors group ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <div className="relative shrink-0">
            <SafeAvatar
              src={adminUser.avatarUrl}
              alt={adminUser.name}
              size="sm"
              className="ring-2 ring-blue-400/40 group-hover:ring-blue-400"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#12B76A] ring-2 ring-[#0F2747]" />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col truncate text-left">
              <span className="text-xs font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                {adminUser.name}
              </span>
              <span className="text-[10px] text-slate-300/80 truncate">
                Super Administrator
              </span>
            </div>
          )}
        </NavLink>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden lg:block fixed inset-y-0 left-0 z-30 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-[#0F2747]/80 backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </aside>
    </>
  );
};

