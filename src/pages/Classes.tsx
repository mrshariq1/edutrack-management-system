import React, { useState } from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { ClassItem } from '../types';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Badge } from '../components/common/Badge';
import { SafeAvatar } from '../components/common/SafeAvatar';
import { ASSETS } from '../assets';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Users,
  DoorOpen,
  Clock,
  GraduationCap,
} from 'lucide-react';

export const Classes: React.FC = () => {
  const { classes, teachers, students, addClass, updateClass, deleteClass } = useEduTrack();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [deletingClass, setDeletingClass] = useState<ClassItem | null>(null);
  const [viewingClassStudents, setViewingClassStudents] = useState<ClassItem | null>(null);

  const initialForm = {
    name: 'Grade 10',
    section: 'C',
    gradeLevel: 10,
    classTeacherId: teachers[0]?.id || '',
    capacity: 35,
    roomNumber: 'Room 305',
    schedule: '08:00 AM - 02:45 PM',
  };
  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setFormData(initialForm);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (c: ClassItem) => {
    setEditingClass(c);
    setFormData({
      name: c.name,
      section: c.section,
      gradeLevel: c.gradeLevel,
      classTeacherId: c.classTeacherId,
      capacity: c.capacity,
      roomNumber: c.roomNumber,
      schedule: c.schedule,
    });
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = teachers.find(t => t.id === formData.classTeacherId);
    addClass({
      name: formData.name,
      section: formData.section,
      displayName: `${formData.name}-${formData.section}`,
      gradeLevel: Number(formData.gradeLevel) || 10,
      classTeacherId: formData.classTeacherId,
      classTeacherName: teacher ? teacher.name : 'Unassigned',
      studentCount: 0,
      capacity: Number(formData.capacity) || 35,
      roomNumber: formData.roomNumber,
      schedule: formData.schedule,
    });
    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    const teacher = teachers.find(t => t.id === formData.classTeacherId);
    updateClass(editingClass.id, {
      name: formData.name,
      section: formData.section,
      displayName: `${formData.name}-${formData.section}`,
      gradeLevel: Number(formData.gradeLevel) || editingClass.gradeLevel,
      classTeacherId: formData.classTeacherId,
      classTeacherName: teacher ? teacher.name : editingClass.classTeacherName,
      capacity: Number(formData.capacity) || editingClass.capacity,
      roomNumber: formData.roomNumber,
      schedule: formData.schedule,
    });
    setEditingClass(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Classrooms & Cohort Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Section divisions, homeroom supervisors, room allotments, and capacity limits.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Class</span>
        </button>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((cls) => {
          const enrolledCount = students.filter(s => s.classId === cls.id).length;
          const utilizationRate = Math.round((enrolledCount / cls.capacity) * 100);

          return (
            <div
              key={cls.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {cls.displayName}
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        Section {cls.section}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Grade Level: {cls.gradeLevel}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cls)}
                      className="p-1.5 rounded text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingClass(cls)}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Class Teacher: <strong className="text-slate-900 dark:text-white">{cls.classTeacherName}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <DoorOpen className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Allocated Room: <strong className="text-slate-900 dark:text-white">{cls.roomNumber}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Daily Schedule: {cls.schedule}</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Student Capacity</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {enrolledCount} / {cls.capacity} ({utilizationRate}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        utilizationRate >= 90
                          ? 'bg-amber-500'
                          : utilizationRate >= 70
                          ? 'bg-blue-600'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, utilizationRate)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  {cls.capacity - enrolledCount} seats available
                </span>
                <button
                  onClick={() => setViewingClassStudents(cls)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>View Roster</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Class Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingClass}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingClass(null);
        }}
        title={editingClass ? `Edit Class: ${editingClass.displayName}` : 'Create Classroom Section'}
        subtitle="Configure section naming, supervisor instructor, and room allocation"
      >
        <form onSubmit={editingClass ? handleSubmitEdit : handleSubmitAdd} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Grade Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Grade 10"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Section Code
              </label>
              <input
                type="text"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value.toUpperCase() })}
                placeholder="e.g. A"
                maxLength={2}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Class Homeroom Teacher
            </label>
            <select
              value={formData.classTeacherId}
              onChange={(e) => setFormData({ ...formData, classTeacherId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              required
            >
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Room Number / Hall
              </label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                placeholder="e.g. Room 301"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Max Student Capacity
              </label>
              <input
                type="number"
                min="10"
                max="60"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Daily Class Schedule
            </label>
            <input
              type="text"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              placeholder="e.g. 08:00 AM - 02:45 PM"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingClass(null);
              }}
              className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              {editingClass ? 'Save Class' : 'Create Class'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Enrolled Students Modal */}
      {viewingClassStudents && (
        <Modal
          isOpen={!!viewingClassStudents}
          onClose={() => setViewingClassStudents(null)}
          title={`Enrolled Students: ${viewingClassStudents.displayName}`}
          subtitle={`Class Teacher: ${viewingClassStudents.classTeacherName} · ${viewingClassStudents.roomNumber}`}
          maxWidth="lg"
        >
          <div className="space-y-3">
            {students.filter(s => s.classId === viewingClassStudents.id).length > 0 ? (
              students
                .filter(s => s.classId === viewingClassStudents.id)
                .map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <SafeAvatar
                        src={s.avatar || (s.gender === 'Female' ? ASSETS.portraits.studentFemale : ASSETS.portraits.studentMale)}
                        alt={`${s.firstName} ${s.lastName}`}
                        name={`${s.firstName} ${s.lastName}`}
                        size="xs"
                      />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">
                          {s.firstName} {s.lastName}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{s.studentId}</span>
                      </div>
                    </div>
                    <Badge variant={s.feeStatus === 'Paid' ? 'success' : 'warning'}>
                      Fees: {s.feeStatus}
                    </Badge>
                  </div>
                ))
            ) : (
              <p className="text-center text-xs text-slate-400 py-6">
                No students currently enrolled in this class section.
              </p>
            )}
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingClass}
        onClose={() => setDeletingClass(null)}
        onConfirm={() => {
          if (deletingClass) {
            deleteClass(deletingClass.id);
            setDeletingClass(null);
          }
        }}
        title="Confirm Class Deletion"
        message={`Are you sure you want to delete "${deletingClass?.displayName}"? Associated students will be marked unassigned.`}
      />
    </div>
  );
};
