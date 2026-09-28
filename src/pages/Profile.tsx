import React, { useState } from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { SafeAvatar } from '../components/common/SafeAvatar';
import {
  User,
  Mail,
  Phone,
  Building,
  Shield,
  Clock,
  Edit2,
  Calendar,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { adminUser, settings, updateAdminUser, notifications } = useEduTrack();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form, setForm] = useState({ ...adminUser });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminUser(form);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <SafeAvatar
            src={adminUser.avatarUrl}
            alt={adminUser.name}
            name={adminUser.name}
            size="xl"
            priority
            className="w-24 h-24 rounded-2xl ring-4 ring-[#1769E0]/20 shadow-md shrink-0"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {adminUser.name}
              </h1>
              <Badge variant="primary">Super Administrator</Badge>
              <Badge variant="success" dot>Active Session</Badge>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {adminUser.role} · {settings.institutionName}
            </p>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {adminUser.bio}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{adminUser.email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{adminUser.phone}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{adminUser.department}</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setForm({ ...adminUser });
              setIsEditModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold shrink-0 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Grid: Credentials & Recent Operational Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Credentials & System Access Details */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Shield className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Security & Access Scopes
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-slate-400 block font-medium">Access Tier</span>
              <strong className="text-slate-900 dark:text-white block mt-0.5">Tier 1 · Full Institutional Root</strong>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Authentication Protocol</span>
              <span className="text-slate-700 dark:text-slate-300 block mt-0.5 font-mono">Demo Session Auth (admin@edutrack.demo)</span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Last Login Timestamp</span>
              <span className="text-slate-700 dark:text-slate-300 block mt-0.5 font-mono">{adminUser.lastLogin}</span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Database Mutability</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">Read / Write / Delete Authorized</span>
            </div>
          </div>
        </div>

        {/* Audit Stream / Recent Activities */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Administrative Events Log
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Realtime</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.map((n) => (
              <div key={n.id} className="py-3 flex items-start gap-3 text-xs">
                <div className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 mt-0.5 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">{n.title}</p>
                  <p className="text-slate-500 mt-0.5">{n.message}</p>
                </div>
                <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Administrator Profile"
        subtitle="Update public registry name and contact info"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Role Title
            </label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Telephone
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Executive Biography
            </label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
            >
              Save Profile
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
