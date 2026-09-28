import React, { useState, useMemo } from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { Student, StudentStatus, FeeStatus, Gender } from '../types';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { SafeAvatar } from '../components/common/SafeAvatar';
import { ASSETS } from '../assets';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Users,
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  CreditCard,
  Award,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const Students: React.FC = () => {
  const { students, classes, addStudent, updateStudent, deleteStudent, fees, grades } = useEduTrack();

  // Search & Filter states
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedFeeStatus, setSelectedFeeStatus] = useState<string>('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'personal' | 'academic' | 'fees' | 'grades'>('personal');

  // Form State
  const initialForm = {
    studentId: `ET-2026-${String(students.length + 1).padStart(3, '0')}`,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male' as Gender,
    dob: '2009-05-15',
    classId: classes[0]?.id || '',
    className: classes[0]?.displayName || '',
    section: classes[0]?.section || 'A',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    admissionDate: new Date().toISOString().split('T')[0],
    status: 'Active' as StudentStatus,
    feeStatus: 'Pending' as FeeStatus,
    attendanceRate: 95.0,
    avatar: '',
  };
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(q) ||
        student.studentId.toLowerCase().includes(q) ||
        student.parentName.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q);

      const matchesClass = selectedClass === 'all' || student.classId === selectedClass;
      const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
      const matchesFee = selectedFeeStatus === 'all' || student.feeStatus === selectedFeeStatus;

      return matchesSearch && matchesClass && matchesStatus && matchesFee;
    });
  }, [students, search, selectedClass, selectedStatus, selectedFeeStatus]);

  // Paginated students
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const handleOpenAdd = () => {
    setFormData({
      ...initialForm,
      studentId: `ET-2026-${String(students.length + 1).padStart(3, '0')}`,
      classId: classes[0]?.id || '',
      className: classes[0]?.displayName || '',
      section: classes[0]?.section || 'A',
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      studentId: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      gender: student.gender,
      dob: student.dob,
      classId: student.classId,
      className: student.className,
      section: student.section,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      parentEmail: student.parentEmail,
      address: student.address,
      admissionDate: student.admissionDate,
      status: student.status,
      feeStatus: student.feeStatus,
      attendanceRate: student.attendanceRate,
      avatar: student.avatar || '',
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email address is required';
    if (!formData.parentName.trim()) errors.parentName = 'Parent/Guardian name is required';
    if (!formData.parentPhone.trim()) errors.parentPhone = 'Parent contact number is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const matchedClass = classes.find(c => c.id === formData.classId);
    const newStudentData = {
      ...formData,
      className: matchedClass ? matchedClass.displayName : formData.className,
      section: matchedClass ? matchedClass.section : formData.section,
      avatar: formData.avatar || `https://images.unsplash.com/photo-${formData.gender === 'Female' ? '1534528741775-53994a69daeb' : '1507003211169-0a1dd7228f2d'}?auto=format&fit=crop&q=80&w=256&h=256`,
    };

    addStudent(newStudentData);
    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !validateForm()) return;

    const matchedClass = classes.find(c => c.id === formData.classId);
    updateStudent(editingStudent.id, {
      ...formData,
      className: matchedClass ? matchedClass.displayName : formData.className,
      section: matchedClass ? matchedClass.section : formData.section,
    });
    setEditingStudent(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Registrar Management
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs font-mono text-slate-500">{students.length} Total Enrolled</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Student Registry & Admissions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Maintain active student files, class allotments, academic records, and guardian liaisons.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-102 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by student name, ID, parent, or email..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden font-medium"
            >
              <option value="all">All Classes</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.displayName}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>

            <select
              value={selectedFeeStatus}
              onChange={(e) => {
                setSelectedFeeStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden font-medium"
            >
              <option value="all">All Fee Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>

            {(search || selectedClass !== 'all' || selectedStatus !== 'all' || selectedFeeStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedClass('all');
                  setSelectedStatus('all');
                  setSelectedFeeStatus('all');
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>
            Found <strong className="text-slate-900 dark:text-white font-mono">{filteredStudents.length}</strong> student records
          </span>
          <span className="font-mono">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      {/* Enterprise Data Table */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        {paginatedStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Student ID</th>
                  <th className="py-3.5 px-4">Cohort</th>
                  <th className="py-3.5 px-4">Guardian</th>
                  <th className="py-3.5 px-4">Attendance Rate</th>
                  <th className="py-3.5 px-4">Fee Status</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {paginatedStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Student Name & Avatar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <SafeAvatar
                          src={student.avatar || (student.gender === 'Female' ? ASSETS.portraits.studentFemale : ASSETS.portraits.studentMale)}
                          alt={`${student.firstName} ${student.lastName}`}
                          name={`${student.firstName} ${student.lastName}`}
                          size="sm"
                        />
                        <div className="truncate">
                          <span
                            onClick={() => {
                              setViewingStudent(student);
                              setActiveProfileTab('personal');
                            }}
                            className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors block"
                          >
                            {student.firstName} {student.lastName}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate block font-mono">
                            {student.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* ID */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-600 dark:text-slate-300">
                      {student.studentId}
                    </td>

                    {/* Class */}
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                      {student.className}
                    </td>

                    {/* Parent */}
                    <td className="py-3 px-4">
                      <span className="text-slate-900 dark:text-white font-semibold block">
                        {student.parentName}
                      </span>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        {student.parentPhone}
                      </span>
                    </td>

                    {/* Attendance */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              student.attendanceRate >= 95
                                ? 'bg-emerald-500'
                                : student.attendanceRate >= 85
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${student.attendanceRate}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                          {student.attendanceRate}%
                        </span>
                      </div>
                    </td>

                    {/* Fee Status */}
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          student.feeStatus === 'Paid'
                            ? 'success'
                            : student.feeStatus === 'Pending'
                            ? 'warning'
                            : 'danger'
                        }
                        dot
                      >
                        {student.feeStatus}
                      </Badge>
                    </td>

                    {/* Enrollment Status */}
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          student.status === 'Active'
                            ? 'primary'
                            : student.status === 'Inactive'
                            ? 'neutral'
                            : 'danger'
                        }
                      >
                        {student.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setViewingStudent(student);
                            setActiveProfileTab('personal');
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                          title="View Profile File"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                          title="Edit Student"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingStudent(student)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Record"
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
        ) : (
          <EmptyState
            icon={<Users className="w-8 h-8" />}
            title="No students found"
            description="Adjust your search criteria or enroll a new student to get started."
            actionLabel="Enroll First Student"
            onAction={handleOpenAdd}
          />
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold ${
                    currentPage === idx + 1
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingStudent}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingStudent(null);
        }}
        title={editingStudent ? `Edit Student: ${editingStudent.firstName} ${editingStudent.lastName}` : 'Enroll New Student'}
        subtitle="Complete institutional registry credentials, contact coordinates, and parent links"
        maxWidth="2xl"
      >
        <form onSubmit={editingStudent ? handleSubmitEdit : handleSubmitAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student ID
              </label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Class / Grade Allotment *
              </label>
              <select
                value={formData.classId}
                onChange={(e) => {
                  const targetCls = classes.find(c => c.id === e.target.value);
                  setFormData({
                    ...formData,
                    classId: e.target.value,
                    className: targetCls?.displayName || '',
                    section: targetCls?.section || 'A',
                  });
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.displayName} ({c.roomNumber})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="e.g. Liam"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
              {formErrors.firstName && <span className="text-[10px] text-rose-500">{formErrors.firstName}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="e.g. Watson"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
              {formErrors.lastName && <span className="text-[10px] text-rose-500">{formErrors.lastName}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Student Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@student.oakridge.edu"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
              {formErrors.email && <span className="text-[10px] text-rose-500">{formErrors.email}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Parent / Guardian Name *
              </label>
              <input
                type="text"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                placeholder="Parent full name"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
              {formErrors.parentName && <span className="text-[10px] text-rose-500">{formErrors.parentName}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Parent Contact Number *
              </label>
              <input
                type="text"
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
              {formErrors.parentPhone && <span className="text-[10px] text-rose-500">{formErrors.parentPhone}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enrollment Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as StudentStatus })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Initial Fee Status
              </label>
              <select
                value={formData.feeStatus}
                onChange={(e) => setFormData({ ...formData, feeStatus: e.target.value as FeeStatus })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Residential Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. 104 Beacon Hill Lane, Cambridge, MA"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingStudent(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
            >
              {editingStudent ? 'Save Student Changes' : 'Confirm Enrollment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Student Full Profile Modal */}
      {viewingStudent && (
        <Modal
          isOpen={!!viewingStudent}
          onClose={() => setViewingStudent(null)}
          title={`Student Profile File: ${viewingStudent.firstName} ${viewingStudent.lastName}`}
          subtitle={`${viewingStudent.studentId} · ${viewingStudent.className} · Enrolled ${viewingStudent.admissionDate}`}
          maxWidth="3xl"
        >
          <div className="space-y-4">
            {/* Header info card */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <SafeAvatar
                src={viewingStudent.avatar || (viewingStudent.gender === 'Female' ? ASSETS.portraits.studentFemale : ASSETS.portraits.studentMale)}
                alt={`${viewingStudent.firstName} ${viewingStudent.lastName}`}
                name={`${viewingStudent.firstName} ${viewingStudent.lastName}`}
                size="xl"
                className="rounded-2xl ring-2 ring-[#1769E0]/30 shrink-0"
              />
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {viewingStudent.firstName} {viewingStudent.lastName}
                  </h3>
                  <Badge variant={viewingStudent.status === 'Active' ? 'primary' : 'neutral'}>
                    {viewingStudent.status}
                  </Badge>
                  <Badge variant={viewingStudent.feeStatus === 'Paid' ? 'success' : 'warning'}>
                    Fees: {viewingStudent.feeStatus}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Class: <strong>{viewingStudent.className}</strong> · Gender: {viewingStudent.gender} · DOB: {viewingStudent.dob}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {viewingStudent.email}</span>
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {viewingStudent.phone}</span>
                </div>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs">
              <button
                onClick={() => setActiveProfileTab('personal')}
                className={`pb-2.5 px-2 font-semibold border-b-2 transition-colors ${
                  activeProfileTab === 'personal'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Personal Details
              </button>
              <button
                onClick={() => setActiveProfileTab('academic')}
                className={`pb-2.5 px-2 font-semibold border-b-2 transition-colors ${
                  activeProfileTab === 'academic'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Academic Allotment
              </button>
              <button
                onClick={() => setActiveProfileTab('fees')}
                className={`pb-2.5 px-2 font-semibold border-b-2 transition-colors ${
                  activeProfileTab === 'fees'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Fee Ledger
              </button>
              <button
                onClick={() => setActiveProfileTab('grades')}
                className={`pb-2.5 px-2 font-semibold border-b-2 transition-colors ${
                  activeProfileTab === 'grades'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Assessment Transcript
              </button>
            </div>

            {/* Tab Contents */}
            {activeProfileTab === 'personal' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <h4 className="font-bold text-slate-900 dark:text-white">Student Information</h4>
                  <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    <p><span className="text-slate-400">Full Legal Name:</span> {viewingStudent.firstName} {viewingStudent.lastName}</p>
                    <p><span className="text-slate-400">Registry ID:</span> <strong className="font-mono text-slate-800 dark:text-slate-200">{viewingStudent.studentId}</strong></p>
                    <p><span className="text-slate-400">Admission Date:</span> {viewingStudent.admissionDate}</p>
                    <p><span className="text-slate-400">Residential Address:</span> {viewingStudent.address || '742 Academic Parkway'}</p>
                  </div>
                </div>

                <div className="space-y-2 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <h4 className="font-bold text-slate-900 dark:text-white">Parent / Guardian Contact</h4>
                  <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    <p><span className="text-slate-400">Guardian Name:</span> {viewingStudent.parentName}</p>
                    <p><span className="text-slate-400">Emergency Phone:</span> <span className="font-mono">{viewingStudent.parentPhone}</span></p>
                    <p><span className="text-slate-400">Guardian Email:</span> <span className="font-mono">{viewingStudent.parentEmail || 'guardian@apexholding.com'}</span></p>
                  </div>
                </div>
              </div>
            )}

            {activeProfileTab === 'academic' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">Assigned Cohort</span>
                    <Badge variant="primary">{viewingStudent.className}</Badge>
                  </div>
                  <p className="text-slate-500">
                    Curriculum Track: Advanced College Preparation · Secondary Education Framework
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span>Attendance Rate:</span>
                    <strong className="font-mono text-emerald-600 dark:text-emerald-400">{viewingStudent.attendanceRate}%</strong>
                  </div>
                </div>
              </div>
            )}

            {activeProfileTab === 'fees' && (
              <div className="space-y-3 text-xs">
                {fees.filter(f => f.studentId === viewingStudent.id).map(fee => (
                  <div key={fee.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{fee.title}</p>
                      <p className="text-[11px] text-slate-400">Invoice: {fee.invoiceNumber} · Due: {fee.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-slate-900 dark:text-white">${fee.amount.toLocaleString()}</p>
                      <Badge variant={fee.status === 'Paid' ? 'success' : 'warning'} size="sm">
                        {fee.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeProfileTab === 'grades' && (
              <div className="space-y-2 text-xs">
                {grades.filter(g => g.studentId === viewingStudent.id).length > 0 ? (
                  grades.filter(g => g.studentId === viewingStudent.id).map(grade => (
                    <div key={grade.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{grade.subjectName}</p>
                        <p className="text-[11px] text-slate-400">{grade.examName} · Remarks: {grade.remarks}</p>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-base font-bold text-blue-600 dark:text-blue-400">{grade.marksObtained}/{grade.totalMarks}</span>
                        <span className="block text-[11px] font-semibold text-slate-500">Grade: {grade.gradeLetter} ({grade.status})</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-400 py-6">No graded exam papers recorded for this student yet.</p>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingStudent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        onConfirm={() => {
          if (deletingStudent) {
            deleteStudent(deletingStudent.id);
            setDeletingStudent(null);
          }
        }}
        title="Confirm Student Deletion"
        message={`Are you sure you want to permanently delete the student file for "${deletingStudent?.firstName} ${deletingStudent?.lastName}" (${deletingStudent?.studentId})?`}
        confirmLabel="Permanently Delete"
      />
    </div>
  );
};
