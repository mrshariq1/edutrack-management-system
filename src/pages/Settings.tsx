import React, { useState } from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { SafeAvatar } from '../components/common/SafeAvatar';
import {
  School,
  User,
  Moon,
  Sun,
  Bell,
  RotateCcw,
  Download,
  Save,
  Shield,
  CheckCircle2,
  Sliders,
  Globe,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const {
    settings,
    adminUser,
    isDarkMode,
    toggleDarkMode,
    updateSettings,
    updateAdminUser,
    resetToDefaultData,
    exportDatabaseJSON,
  } = useEduTrack();

  const [activeTab, setActiveTab] = useState<'general' | 'institution' | 'profile' | 'notifications' | 'appearance' | 'security'>('general');

  // Form states
  const [instForm, setInstForm] = useState({ ...settings });
  const [adminForm, setAdminForm] = useState({ ...adminUser });
  const [saveToast, setSaveToast] = useState(false);

  const showSaveSuccess = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(instForm);
    showSaveSuccess();
  };

  const handleSaveInstitution = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(instForm);
    showSaveSuccess();
  };

  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminUser(adminForm);
    showSaveSuccess();
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(instForm);
    showSaveSuccess();
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#12B76A] text-white text-xs font-bold shadow-lg animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Settings saved successfully</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          System Preferences & Configuration
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Institutional identity parameters, administrator profile, theme styling, notification toggles, and data security.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-slate-200 dark:border-slate-800 text-xs overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-2.5 px-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'general'
              ? 'border-[#1769E0] text-[#1769E0] dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>General</span>
        </button>

        <button
          onClick={() => setActiveTab('institution')}
          className={`pb-2.5 px-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'institution'
              ? 'border-[#1769E0] text-[#1769E0] dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <School className="w-4 h-4" />
          <span>Institution</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-2.5 px-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'profile'
              ? 'border-[#1769E0] text-[#1769E0] dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-2.5 px-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'notifications'
              ? 'border-[#1769E0] text-[#1769E0] dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`pb-2.5 px-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'appearance'
              ? 'border-[#1769E0] text-[#1769E0] dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Moon className="w-4 h-4" />
          <span>Appearance</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-2.5 px-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'security'
              ? 'border-[#1769E0] text-[#1769E0] dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security</span>
        </button>
      </div>

      {/* Tab 1: General */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-5 text-xs">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              General Academic Operations
            </h3>
            <p className="text-slate-500">
              Basic operational settings, academic calendar parameters, and localization.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Active Academic Year
              </label>
              <input
                type="text"
                value={instForm.academicYear}
                onChange={(e) => setInstForm({ ...instForm, academicYear: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={instForm.currencySymbol}
                onChange={(e) => setInstForm({ ...instForm, currencySymbol: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Platform Language
              </label>
              <select className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium">
                <option value="en">English (US Standard)</option>
                <option value="uk">English (UK International)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date Display Format
              </label>
              <select className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium font-mono">
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={instForm.allowStudentRegistration}
                onChange={(e) => setInstForm({ ...instForm, allowStudentRegistration: e.target.checked })}
                className="rounded border-slate-300 text-[#1769E0] focus:ring-[#1769E0]"
              />
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Allow Student Self-Enrollment Portal
                </span>
                <span className="text-[11px] text-slate-500">
                  Permits guardians to submit admission inquiries directly via student onboarding links.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 font-semibold text-white bg-[#1769E0] hover:bg-[#0F2747] rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save General Preferences</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Institution */}
      {activeTab === 'institution' && (
        <form onSubmit={handleSaveInstitution} className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-5 text-xs">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Institutional Identity & Legal Details
            </h3>
            <p className="text-slate-500">
              Information displayed on official transcripts, receipts, and circular headers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institution Name *
              </label>
              <input
                type="text"
                value={instForm.institutionName}
                onChange={(e) => setInstForm({ ...instForm, institutionName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Tagline
              </label>
              <input
                type="text"
                value={instForm.tagline}
                onChange={(e) => setInstForm({ ...instForm, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Head of Institution / Principal *
              </label>
              <input
                type="text"
                value={instForm.principalName}
                onChange={(e) => setInstForm({ ...instForm, principalName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Accreditation Registry Code
              </label>
              <input
                type="text"
                value={instForm.registrationNumber}
                onChange={(e) => setInstForm({ ...instForm, registrationNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Administrative Contact Email
              </label>
              <input
                type="email"
                value={instForm.email}
                onChange={(e) => setInstForm({ ...instForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Switchboard Telephone
              </label>
              <input
                type="text"
                value={instForm.phone}
                onChange={(e) => setInstForm({ ...instForm, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Physical Campus Address
              </label>
              <input
                type="text"
                value={instForm.address}
                onChange={(e) => setInstForm({ ...instForm, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 font-semibold text-white bg-[#1769E0] hover:bg-[#0F2747] rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Institutional Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveAdmin} className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-5 text-xs">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Administrator Account
              </h3>
              <p className="text-slate-500">
                Credentials and operational profile for the authenticated session.
              </p>
            </div>
            <SafeAvatar
              src={adminForm.avatarUrl}
              alt={adminForm.name}
              size="lg"
              priority
              className="ring-2 ring-[#1769E0]/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                value={adminForm.name}
                onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Role / Title
              </label>
              <input
                type="text"
                value={adminForm.role}
                onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={adminForm.email}
                onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Direct Line Telephone
              </label>
              <input
                type="text"
                value={adminForm.phone}
                onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Executive Bio
            </label>
            <textarea
              rows={3}
              value={adminForm.bio}
              onChange={(e) => setAdminForm({ ...adminForm, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 font-semibold text-white bg-[#1769E0] hover:bg-[#0F2747] rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Update Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveNotifications} className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-5 text-xs">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Institutional Notification Channels
            </h3>
            <p className="text-slate-500">
              Configure broadcast alerts for emergency circulars, roll call confirmations, and fee reminders.
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <input
                type="checkbox"
                checked={instForm.enableEmailAlerts}
                onChange={(e) => setInstForm({ ...instForm, enableEmailAlerts: e.target.checked })}
                className="rounded border-slate-300 text-[#1769E0] focus:ring-[#1769E0]"
              />
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Email Delivery Gateway
                </span>
                <span className="text-[11px] text-slate-500">
                  Transmit fee invoice vouchers and official grade transcripts to parent inboxes.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <input
                type="checkbox"
                checked={instForm.enableSmsAlerts}
                onChange={(e) => setInstForm({ ...instForm, enableSmsAlerts: e.target.checked })}
                className="rounded border-slate-300 text-[#1769E0] focus:ring-[#1769E0]"
              />
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  SMS Emergency Alert System
                </span>
                <span className="text-[11px] text-slate-500">
                  Send immediate SMS alerts to parents if a student is marked Absent without prior excuse.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 font-semibold text-white bg-[#1769E0] hover:bg-[#0F2747] rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Notification Channels</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 5: Appearance */}
      {activeTab === 'appearance' && (
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Color Theme & Visual Ergonomics
            </h3>
            <p className="text-slate-500">
              Customize the dashboard color mode for daylight or high-contrast evening administration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => {
                if (isDarkMode) toggleDarkMode();
              }}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                !isDarkMode
                  ? 'border-[#1769E0] bg-[#EAF3FF] shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light Mode</span>
                </span>
                {!isDarkMode && <CheckCircle2 className="w-4 h-4 text-[#1769E0]" />}
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Clean #F6F8FC canvas, crisp neutrals, and optimal contrast for daylight classroom viewing and print outputs.
              </p>
            </div>

            <div
              onClick={() => {
                if (!isDarkMode) toggleDarkMode();
              }}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isDarkMode
                  ? 'border-[#1769E0] bg-[#0A1D36] shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Moon className="w-4 h-4 text-blue-400" />
                  <span>Dark Mode</span>
                </span>
                {isDarkMode && <CheckCircle2 className="w-4 h-4 text-[#1769E0]" />}
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Deep navy #0F2747 surfaces with optical compensation for reduced eye fatigue during extended auditing sessions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Security */}
      {activeTab === 'security' && (
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Data Storage & Security Backups
            </h3>
            <p className="text-slate-500">
              All student, exam, timetable, fee, and notice modifications persist reliably in browser storage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Download className="w-4 h-4 text-[#1769E0]" />
                <span>Export System Snapshot</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Download a complete JSON database dump containing all student files, attendance logs, and financial invoices.
              </p>
              <button
                type="button"
                onClick={exportDatabaseJSON}
                className="px-4 py-2 font-semibold text-white bg-[#1769E0] hover:bg-[#0F2747] rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Download JSON Backup
              </button>
            </div>

            <div className="p-4 rounded-xl border border-rose-100 dark:border-rose-950 bg-rose-50/20 dark:bg-rose-950/10 space-y-3">
              <div className="flex items-center gap-2 font-bold text-[#F04438] dark:text-rose-400">
                <RotateCcw className="w-4 h-4 text-[#F04438]" />
                <span>Reset to Factory Demo Data</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Wipe all local storage mutations and restore the curated 2026 Oakridge Academy demonstration records.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all demo data back to clean initial states?')) {
                    resetToDefaultData();
                  }
                }}
                className="px-4 py-2 font-semibold text-white bg-[#F04438] hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
