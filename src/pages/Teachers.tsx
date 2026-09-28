import React, { useState, useMemo } from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { Teacher, TeacherStatus, Gender } from '../types';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { SafeAvatar } from '../components/common/SafeAvatar';
import { ASSETS } from '../assets';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Eye,
  Edit2,
  Trash2,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Calendar,
  Building,
  DoorOpen,
} from 'lucide-react';

export const Teachers: React.FC = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useEduTrack();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);

  // Form State
  const initialForm = {
    teacherId: `TCH-${100 + teachers.length + 1}`,
    name: '',
    email: '',
    phone: '',
    gender: 'Female' as Gender,
    department: 'Mathematics & Computing',
    subjects: 'Advanced Mathematics',
    classes: 'Grade 10-A, Grade 11-A',
    qualification: 'M.Sc. Mathematics',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'Active' as TeacherStatus,
    salary: 75000,
    room: 'Office 204',
    avatar: '',
  };
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Departments list
  const departments = useMemo(() => {
    const set = new Set(teachers.map(t => t.department));
    return Array.from(set);
  }, [teachers]);

  // Filtered teachers
  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        t.name.toLowerCase().includes(q) ||
        t.teacherId.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.subjects.some(s => s.toLowerCase().includes(q));

      const matchesDept = selectedDept === 'all' || t.department === selectedDept;
      const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [teachers, search, selectedDept, selectedStatus]);

  const handleOpenAdd = () => {
    setFormData({
      ...initialForm,
      teacherId: `TCH-${100 + teachers.length + 1}`,
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setFormData({
      teacherId: t.teacherId,
      name: t.name,
      email: t.email,
      phone: t.phone,
      gender: t.gender,
      department: t.department,
      subjects: t.subjects.join(', '),
      classes: t.classes.join(', '),
      qualification: t.qualification,
      joiningDate: t.joiningDate,
      status: t.status,
      salary: t.salary,
      room: t.room || 'Office 101',
      avatar: t.avatar || '',
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Academic email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.subjects.trim()) errors.subjects = 'At least one subject is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    addTeacher({
      teacherId: formData.teacherId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      department: formData.department,
      subjects: formData.subjects.split(',').map(s => s.trim()).filter(Boolean),
      classes: formData.classes.split(',').map(c => c.trim()).filter(Boolean),
      qualification: formData.qualification,
      joiningDate: formData.joiningDate,
      status: formData.status,
      salary: Number(formData.salary) || 70000,
      room: formData.room,
      avatar: formData.avatar || (formData.gender === 'Female' ? ASSETS.avatars.teacher1 : ASSETS.avatars.teacher2),
    });
    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher || !validateForm()) return;

    updateTeacher(editingTeacher.id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      department: formData.department,
      subjects: formData.subjects.split(',').map(s => s.trim()).filter(Boolean),
      classes: formData.classes.split(',').map(c => c.trim()).filter(Boolean),
      qualification: formData.qualification,
      joiningDate: formData.joiningDate,
      status: formData.status,
      salary: Number(formData.salary) || editingTeacher.salary,
      room: formData.room,
    });
    setEditingTeacher(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Academic Faculty
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs font-mono text-slate-500">{teachers.length} Active Instructors</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Faculty & Academic Instructors
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Departmental roster, instructional workloads, assigned cohorts, and credential profiles.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-102 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Appoint Faculty Member</span>
        </button>
      </div>

      {/* Filter and View Mode Toolbar */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search faculty name, ID, subject, email..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden font-medium"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden font-medium"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 self-end md:self-center border border-slate-200 dark:border-slate-800 p-1 rounded-xl bg-slate-50 dark:bg-slate-800">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Rendering: Grid vs Table */}
      {filteredTeachers.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="group rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-blue-400 dark:hover:border-blue-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <SafeAvatar
                        src={teacher.avatar || (teacher.gender === 'Female' ? ASSETS.portraits.teacherFemale : ASSETS.portraits.teacherMale)}
                        alt={teacher.name}
                        name={teacher.name}
                        size="lg"
                        className="rounded-2xl ring-2 ring-slate-100 dark:ring-slate-800 shrink-0 group-hover:ring-[#1769E0]/40 transition-all"
                      />
                      <div>
                        <h3
                          onClick={() => setViewingTeacher(teacher)}
                          className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                        >
                          {teacher.name}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block font-medium">
                          {teacher.teacherId} · {teacher.room || 'Office 101'}
                        </span>
                      </div>
                    </div>
                    <Badge variant={teacher.status === 'Active' ? 'success' : 'warning'} size="sm">
                      {teacher.status}
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-semibold">{teacher.department}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{teacher.subjects.join(', ')}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-mono">{teacher.email}</span>
                    </div>
                  </div>

                  {/* Assigned Classes */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Cohorts:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {teacher.classes.join(' · ')}
                    </span>
                  </div>
                </div>

                {/* Card footer actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">Since {teacher.joiningDate}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewingTeacher(teacher)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(teacher)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Record"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingTeacher(teacher)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3.5 px-4">Instructor</th>
                    <th className="py-3.5 px-4">Faculty ID</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Subject Expertise</th>
                    <th className="py-3.5 px-4">Assigned Cohorts</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <SafeAvatar
                            src={teacher.avatar || (teacher.gender === 'Female' ? ASSETS.portraits.teacherFemale : ASSETS.portraits.teacherMale)}
                            alt={teacher.name}
                            name={teacher.name}
                            size="sm"
                          />
                          <div>
                            <span
                              onClick={() => setViewingTeacher(teacher)}
                              className="font-bold text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer block"
                            >
                              {teacher.name}
                            </span>
                            <span className="text-[11px] text-slate-400 block font-mono">{teacher.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-600 dark:text-slate-300">
                        {teacher.teacherId}
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                        {teacher.department}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {teacher.subjects.join(', ')}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">
                        {teacher.classes.join(', ')}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={teacher.status === 'Active' ? 'success' : 'warning'}>
                          {teacher.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewingTeacher(teacher)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(teacher)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingTeacher(teacher)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <EmptyState
          icon={<GraduationCap className="w-8 h-8" />}
          title="No faculty members found"
          description="Adjust your search criteria or register a new faculty appointment."
          actionLabel="Add Faculty Member"
          onAction={handleOpenAdd}
        />
      )}

      {/* Add / Edit Teacher Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingTeacher}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTeacher(null);
        }}
        title={editingTeacher ? `Edit Faculty: ${editingTeacher.name}` : 'Appoint Faculty Member'}
        subtitle="Department allocation, qualification, and scheduled cohorts"
        maxWidth="2xl"
      >
        <form onSubmit={editingTeacher ? handleSubmitEdit : handleSubmitAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Faculty ID
              </label>
              <input
                type="text"
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. Arthur Campbell"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
              {formErrors.name && <span className="text-[10px] text-rose-500">{formErrors.name}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="faculty@oakridge-academy.edu"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
              {formErrors.email && <span className="text-[10px] text-rose-500">{formErrors.email}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Contact *
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Mathematics & Computing">Mathematics & Computing</option>
                <option value="Natural Sciences">Natural Sciences</option>
                <option value="Humanities & Literature">Humanities & Literature</option>
                <option value="Social Sciences">Social Sciences</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Fine Arts & Design">Fine Arts & Design</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Subject(s) *
              </label>
              <input
                type="text"
                value={formData.subjects}
                onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                placeholder="Advanced Calculus, Linear Algebra"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Cohorts
              </label>
              <input
                type="text"
                value={formData.classes}
                onChange={(e) => setFormData({ ...formData, classes: e.target.value })}
                placeholder="Grade 10-A, Grade 12-A"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Faculty Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TeacherStatus })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Highest Qualification & Institution
            </label>
            <input
              type="text"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              placeholder="e.g. Ph.D. Applied Mathematics, MIT"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingTeacher(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
            >
              {editingTeacher ? 'Update Faculty Record' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Teacher Details Modal */}
      {viewingTeacher && (
        <Modal
          isOpen={!!viewingTeacher}
          onClose={() => setViewingTeacher(null)}
          title={`Faculty Record: ${viewingTeacher.name}`}
          subtitle={`${viewingTeacher.teacherId} · ${viewingTeacher.department}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <SafeAvatar
                src={viewingTeacher.avatar || (viewingTeacher.gender === 'Female' ? ASSETS.portraits.teacherFemale : ASSETS.portraits.teacherMale)}
                alt={viewingTeacher.name}
                name={viewingTeacher.name}
                size="xl"
                className="rounded-2xl ring-2 ring-[#1769E0]/30 shrink-0"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {viewingTeacher.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  {viewingTeacher.qualification}
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <Badge variant={viewingTeacher.status === 'Active' ? 'success' : 'warning'}>
                    {viewingTeacher.status}
                  </Badge>
                  <span className="font-mono text-slate-500">Office: {viewingTeacher.room || 'Room 204'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <h4 className="font-bold text-slate-900 dark:text-white">Contact & Employment</h4>
              <p><span className="text-slate-400">Institutional Email:</span> <span className="font-mono">{viewingTeacher.email}</span></p>
              <p><span className="text-slate-400">Telephone:</span> <span className="font-mono">{viewingTeacher.phone}</span></p>
              <p><span className="text-slate-400">Joining Date:</span> {viewingTeacher.joiningDate}</p>
              <p><span className="text-slate-400">Assigned Cohorts:</span> <strong>{viewingTeacher.classes.join(', ')}</strong></p>
              <p><span className="text-slate-400">Subjects Instructed:</span> {viewingTeacher.subjects.join(', ')}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewingTeacher(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Close File
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingTeacher}
        onClose={() => setDeletingTeacher(null)}
        onConfirm={() => {
          if (deletingTeacher) {
            deleteTeacher(deletingTeacher.id);
            setDeletingTeacher(null);
          }
        }}
        title="Confirm Faculty Removal"
        message={`Are you sure you want to remove "${deletingTeacher?.name}" (${deletingTeacher?.teacherId}) from active faculty records?`}
        confirmLabel="Remove Faculty"
      />
    </div>
  );
};
