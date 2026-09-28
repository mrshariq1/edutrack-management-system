import React, { useState, useMemo } from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { Parent } from '../types';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Badge } from '../components/common/Badge';
import {
  UserCheck,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Users,
  Edit2,
  Trash2,
  Eye,
} from 'lucide-react';

export const Parents: React.FC = () => {
  const { parents, students, addParent, updateParent, deleteParent } = useEduTrack();

  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [viewingParent, setViewingParent] = useState<Parent | null>(null);
  const [deletingParent, setDeletingParent] = useState<Parent | null>(null);

  const initialForm = {
    name: '',
    relationship: 'Father' as Parent['relationship'],
    email: '',
    phone: '',
    occupation: '',
    address: 'Cambridge, MA',
    linkedStudentIds: [students[0]?.id || ''],
    status: 'Active' as Parent['status'],
  };
  const [formData, setFormData] = useState(initialForm);

  const filteredParents = useMemo(() => {
    return parents.filter((p) => {
      const q = search.toLowerCase();
      return (
        !search ||
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.occupation.toLowerCase().includes(q)
      );
    });
  }, [parents, search]);

  const handleOpenAdd = () => {
    setFormData(initialForm);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Parent) => {
    setEditingParent(p);
    setFormData({
      name: p.name,
      relationship: p.relationship,
      email: p.email,
      phone: p.phone,
      occupation: p.occupation,
      address: p.address,
      linkedStudentIds: p.linkedStudentIds,
      status: p.status,
    });
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;
    addParent(formData);
    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParent) return;
    updateParent(editingParent.id, formData);
    setEditingParent(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Parents & Guardian Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Guardian liaison records, emergency contacts, occupation details, and student family links.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Parent Profile</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search parent name, phone, occupation, or email..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
          />
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {filteredParents.length} registered guardians
        </span>
      </div>

      {/* Parents Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredParents.map((parent) => {
          const linkedStudents = students.filter(s => parent.linkedStudentIds.includes(s.id));

          return (
            <div
              key={parent.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {parent.relationship}
                    </span>
                    <h3
                      onClick={() => setViewingParent(parent)}
                      className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer block mt-0.5"
                    >
                      {parent.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span>{parent.occupation || 'Professional'}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(parent)}
                      className="p-1.5 rounded text-slate-400 hover:text-amber-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingParent(parent)}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{parent.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{parent.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{parent.address}</span>
                  </div>
                </div>

                {/* Linked Students info */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Linked Students ({linkedStudents.length})
                  </span>
                  <div className="space-y-1.5">
                    {linkedStudents.map(st => (
                      <div key={st.id} className="flex items-center justify-between text-xs py-0.5">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {st.firstName} {st.lastName} ({st.className})
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#1769E0] font-semibold">
                            {st.attendanceRate}% Att.
                          </span>
                          <Badge variant={st.feeStatus === 'Paid' ? 'success' : 'warning'} size="sm">
                            {st.feeStatus}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <Badge variant={parent.status === 'Active' ? 'success' : 'neutral'} size="sm">
                  {parent.status}
                </Badge>
                <button
                  onClick={() => setViewingParent(parent)}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Parent Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingParent}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingParent(null);
        }}
        title={editingParent ? `Edit Parent Profile: ${editingParent.name}` : 'Register Parent Profile'}
        subtitle="Emergency contact coordinates and linked students"
      >
        <form onSubmit={editingParent ? handleSubmitEdit : handleSubmitAdd} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Lawrence Hayes"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Relationship
              </label>
              <select
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="parent@domain.com"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Occupation / Employer
              </label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="e.g. Senior Software Architect"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Residential Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. 42 Pinecrest Boulevard, Boston, MA"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Link Student Record
            </label>
            <select
              value={formData.linkedStudentIds[0] || ''}
              onChange={(e) => setFormData({ ...formData, linkedStudentIds: [e.target.value] })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.studentId} · {s.className})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingParent(null);
              }}
              className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              {editingParent ? 'Update Profile' : 'Save Guardian'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Parent Modal */}
      {viewingParent && (
        <Modal
          isOpen={!!viewingParent}
          onClose={() => setViewingParent(null)}
          title={`Guardian Profile: ${viewingParent.name}`}
          subtitle={`${viewingParent.relationship} · ${viewingParent.occupation}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
              <p><span className="text-slate-400">Phone:</span> {viewingParent.phone}</p>
              <p><span className="text-slate-400">Email:</span> {viewingParent.email}</p>
              <p><span className="text-slate-400">Address:</span> {viewingParent.address}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 dark:text-white">Linked Students</h4>
              {students.filter(s => viewingParent.linkedStudentIds.includes(s.id)).map(st => (
                <div key={st.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">{st.firstName} {st.lastName}</span>
                    <span className="text-[11px] text-slate-400">{st.className} · Attendance: {st.attendanceRate}%</span>
                  </div>
                  <Badge variant={st.feeStatus === 'Paid' ? 'success' : 'warning'}>
                    Fees: {st.feeStatus}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingParent}
        onClose={() => setDeletingParent(null)}
        onConfirm={() => {
          if (deletingParent) {
            deleteParent(deletingParent.id);
            setDeletingParent(null);
          }
        }}
        title="Delete Parent Record"
        message={`Are you sure you want to remove the contact profile for "${deletingParent?.name}"?`}
      />
    </div>
  );
};
