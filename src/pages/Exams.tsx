import React, { useState, useMemo } from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { Exam, ExamStatus } from '../types';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Badge } from '../components/common/Badge';
import {
  FileSpreadsheet,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Layers,
  Award,
} from 'lucide-react';

export const Exams: React.FC = () => {
  const { exams, examSchedules, classes, addExam, updateExam, deleteExam } = useEduTrack();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'schedule' | 'all'>('upcoming');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [deletingExam, setDeletingExam] = useState<Exam | null>(null);

  const initialForm = {
    name: '',
    term: 'Mid-Term' as Exam['term'],
    examType: 'Written' as Exam['examType'],
    startDate: '2026-10-15',
    endDate: '2026-10-25',
    classes: ['Grade 10-A', 'Grade 11-A'],
    status: 'Upcoming' as ExamStatus,
    totalMarks: 100,
  };
  const [formData, setFormData] = useState(initialForm);

  const filteredExams = useMemo(() => {
    if (activeTab === 'upcoming') {
      return exams.filter(e => e.status === 'Upcoming' || e.status === 'Ongoing');
    }
    return exams;
  }, [exams, activeTab]);

  const handleOpenAdd = () => {
    setFormData(initialForm);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      name: exam.name,
      term: exam.term,
      examType: exam.examType,
      startDate: exam.startDate,
      endDate: exam.endDate,
      classes: exam.classes,
      status: exam.status,
      totalMarks: exam.totalMarks,
    });
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addExam({
      ...formData,
    });
    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExam) return;
    updateExam(editingExam.id, {
      ...formData,
    });
    setEditingExam(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Examinations & Academic Assessments
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Standardized examination series, timetable schedules, invigilator assignments, and grading status.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Exam</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-2.5 px-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'upcoming'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Upcoming Assessments ({exams.filter(e => e.status === 'Upcoming' || e.status === 'Ongoing').length})
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`pb-2.5 px-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'schedule'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Hall Allotment & Invigilation ({examSchedules.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-2.5 px-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          All Examination Records ({exams.length})
        </button>
      </div>

      {/* Tab: Exams Cards */}
      {activeTab !== 'schedule' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {exam.term} · {exam.examType}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {exam.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(exam)}
                      className="p-1.5 rounded text-slate-400 hover:text-amber-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingExam(exam)}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Duration: {exam.startDate} — {exam.endDate}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Cohorts: {exam.classes.join(', ')}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Scoring: {exam.totalMarks} Total Marks</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <Badge
                  variant={
                    exam.status === 'Completed'
                      ? 'success'
                      : exam.status === 'Ongoing'
                      ? 'warning'
                      : 'primary'
                  }
                  size="sm"
                >
                  {exam.status}
                </Badge>
                <span className="text-[11px] font-mono text-slate-400">Standardized</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Exam Schedule Table */}
      {activeTab === 'schedule' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4">Subject Paper</th>
                  <th className="py-3 px-4">Examination Series</th>
                  <th className="py-3 px-4">Cohort</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Hall / Room</th>
                  <th className="py-3 px-4">Exam Invigilator</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {examSchedules.map((sch) => {
                  const examObj = exams.find(e => e.id === sch.examId);
                  const status = examObj?.status || 'Upcoming';
                  return (
                    <tr key={sch.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {sch.subjectName}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {sch.examName}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {sch.className}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                        {sch.date} ({sch.startTime} - {sch.endTime})
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {sch.room}
                      </td>
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">
                        {sch.supervisor}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            status === 'Completed'
                              ? 'success'
                              : status === 'Ongoing'
                              ? 'warning'
                              : 'primary'
                          }
                          size="sm"
                        >
                          {status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Exam Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingExam}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingExam(null);
        }}
        title={editingExam ? `Edit Exam: ${editingExam.name}` : 'Schedule Examination Series'}
        subtitle="Specify testing period, terms, cohorts, and evaluation rubric"
      >
        <form onSubmit={editingExam ? handleSubmitEdit : handleSubmitAdd} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Examination Title *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Mid-Term Examinations Term II"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Term Cadence
              </label>
              <select
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="First Term">First Term</option>
                <option value="Mid-Term">Mid-Term</option>
                <option value="Final Term">Final Term</option>
                <option value="Unit Test">Unit Test</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assessment Format
              </label>
              <select
                value={formData.examType}
                onChange={(e) => setFormData({ ...formData, examType: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Written">Written</option>
                <option value="Practical">Practical</option>
                <option value="Online">Online</option>
                <option value="Combined">Combined</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Commencement Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Conclusion Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Max Marks
              </label>
              <input
                type="number"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ExamStatus })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Graded">Graded</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingExam(null);
              }}
              className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              {editingExam ? 'Save Exam' : 'Schedule Exam'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingExam}
        onClose={() => setDeletingExam(null)}
        onConfirm={() => {
          if (deletingExam) {
            deleteExam(deletingExam.id);
            setDeletingExam(null);
          }
        }}
        title="Confirm Exam Deletion"
        message={`Delete "${deletingExam?.name}"? All assigned schedule items and related grade cards will be removed.`}
      />
    </div>
  );
};
