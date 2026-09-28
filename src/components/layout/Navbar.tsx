import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useEduTrack } from '../../context/EduTrackContext';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  LogOut,
  User,
  Settings as SettingsIcon,
  RotateCcw,
  Check,
  Trash2,
  ChevronDown,
  Sparkles,
  Command,
} from 'lucide-react';
import { QuickActionModal } from '../common/QuickActionModal';
import { SafeAvatar } from '../common/SafeAvatar';

interface NavbarProps {
  onOpenMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isDarkMode,
    toggleDarkMode,
    adminUser,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    globalSearch,
    resetToDefaultData,
    logout,
  } = useEduTrack();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Notification menu state
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Profile menu state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Quick action modal
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  const searchResults = globalSearch(searchQuery);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute breadcrumb path
  const pathName = location.pathname.replace('/', '');
  const sectionLabel = pathName
    ? pathName.charAt(0).toUpperCase() + pathName.slice(1)
    : 'Dashboard';

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 sm:px-6">
        {/* Left: Mobile hamburger & Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb on larger screens */}
          <div className="hidden xl:flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mr-2 shrink-0">
            <span>EduTrack</span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="font-semibold text-slate-900 dark:text-white">{sectionLabel}</span>
          </div>

          {/* Search container */}
          <div ref={searchRef} className="relative w-full">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search students, faculty, classes, notices..."
                className="w-full pl-9 pr-14 py-2 text-xs rounded-lg border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <div className="absolute right-2.5 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] text-slate-400 font-mono">
                <Command className="w-2.5 h-2.5" /> K
              </div>
            </div>

            {/* Instant Search Results Dropdown */}
            {isSearchOpen && searchQuery.trim().length >= 2 && (
              <div className="absolute left-0 mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden z-50">
                <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>Results ({searchResults.length})</span>
                  <span className="text-[10px] lowercase font-normal text-slate-400">Esc to close</span>
                </div>

                {searchResults.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {searchResults.map((res) => (
                      <button
                        key={`${res.type}-${res.id}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                          navigate(res.link);
                        }}
                        className="w-full flex items-start gap-3 px-3.5 py-2.5 hover:bg-blue-50/60 dark:hover:bg-blue-950/30 text-left transition-colors group"
                      >
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0 mt-0.5">
                          {res.type}
                        </span>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                            {res.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {res.subtitle}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    No matching institutional records found for &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-4">
          {/* Quick Action Button */}
          <button
            onClick={() => setIsQuickActionOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Action</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Notifications Tray
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 font-medium"
                    >
                      <Check className="w-3 h-3" /> Mark all read
                    </button>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <button
                      onClick={clearNotifications}
                      className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-0.5"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length > 0 ? (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          markNotificationAsRead(item.id);
                          if (item.link) {
                            setIsNotifOpen(false);
                            navigate(item.link);
                          }
                        }}
                        className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                          !item.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {item.title}
                          </p>
                          <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                            {item.time}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No notifications in your tray
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="User profile menu"
            >
              <SafeAvatar
                src={adminUser.avatarUrl}
                alt={adminUser.name}
                size="sm"
                priority
                className="ring-2 ring-[#1769E0]/20"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {adminUser.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Super Admin
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden z-50 divide-y divide-slate-100 dark:divide-slate-800">
                <div className="px-4 py-3 bg-slate-50/70 dark:bg-slate-800/40">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {adminUser.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                    {adminUser.email}
                  </p>
                </div>

                <div className="p-1 space-y-0.5">
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Administrator Profile</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4 text-slate-400" />
                    <span>System Settings</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (window.confirm('Reset all demo data back to clean factory states?')) {
                        resetToDefaultData();
                      }
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-500" />
                    <span>Reset Demo Data</span>
                  </button>
                </div>

                <div className="p-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors text-left font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
      />
    </>
  );
};
