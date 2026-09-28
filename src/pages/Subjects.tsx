import React, { useState } from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { Subject } from '../types';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Badge } from '../components/common/Badge';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  GraduationCap,
  Clock,
  Layers,
} from 'lucide-react';

export const Subjects: React.FC = () => {
  const { subjects, teachers, classes, addSubject, updateSubject, deleteSubject } = useEduTrack();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);

  const initialForm = {
    code: 'MATH-202',
    name: '',
    department: 'Mathematics',
    teacherId: teachers[0]?.id || '',
    classes: ['Grade 10-A'],
    weeklyHours: 4,
    credits: 3,
    status: 'Active' as Subject['status'],
  };
  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setFormData(initialForm);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (s: Subject) => {
    setEditingSubject(s);
    setFormData({
      code: s.code,
      name: s.name,
      department: s.department,
      teacherId: s.teacherId,
      classes: s.classes,
      weeklyHours: s.weeklyHours,
      credits: s.credits,
      status: s.status,
    });
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = teachers.find(t => t.id === formData.teacherId);
    addSubject({
      ...formData,
      teacherName: teacher ? teacher.name : 'Unassigned',
    });
    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;
    const teacher = teachers.find(t => t.id === formData.teacherId);
    updateSubject(editingSubject.id, {
      ...formData,
      teacherName: teacher ? teacher.name : editingSubject.teacherName,
    });
    setEditingSubject(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Curriculum & Subject Catalog
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Departmental course codes, credit weighting, instructional hours, and teacher assignments.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Course Subject</span>
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {sub.code}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                    {sub.name}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Dept: {sub.department}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(sub)}
                    className="p-1.5 rounded text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingSubject(sub)}
                    className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Lead Instructor: <strong className="text-slate-900 dark:text-white">{sub.teacherName}</strong></span>
                </div>

                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Assigned Classes: {sub.classes.join(', ')}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{sub.weeklyHours} hours/week · {sub.credits} Academic Credits</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <Badge variant={sub.status === 'Active' ? 'success' : 'neutral'} size="sm">
                {sub.status}
              </Badge>
              <span className="text-[11px] font-mono text-slate-400">Curriculum standard 2026</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingSubject}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingSubject(null);
        }}
        title={editingSubject ? `Edit Subject: ${editingSubject.name}` : 'Add Course Subject'}
        subtitle="Catalog classification, credit metrics, and faculty leader"
      >
        <form onSubmit={editingSubject ? handleSubmitEdit : handleSubmitAdd} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Course Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. MATH-201"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject Title *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Advanced Calculus"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Natural Sciences">Natural Sciences</option>
                <option value="Humanities">Humanities</option>
                <option value="Social Sciences">Social Sciences</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Fine Arts">Fine Arts</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lead Teacher
              </label>
              <select
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Weekly Hours
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={formData.weeklyHours}
                onChange={(e) => setFormData({ ...formData, weeklyHours: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Credits
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingSubject(null);
              }}
              className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              {editingSubject ? 'Update Subject' : 'Add Subject'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingSubject}
        onClose={() => setDeletingSubject(null)}
        onConfirm={() => {
          if (deletingSubject) {
            deleteSubject(deletingSubject.id);
            setDeletingSubject(null);
          }
        }}
        title="Confirm Subject Deletion"
        message={`Delete "${deletingSubject?.name}" (${deletingSubject?.code})? Timetable slots referencing this subject will need reconfiguration.`}
      />
    </div>
  );
};
