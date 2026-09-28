import React, { useState, useMemo } from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { GradeRecord } from '../types';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Badge } from '../components/common/Badge';
import {
  Award,
  Plus,
  Search,
  Printer,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  School,
  TrendingUp,
  BarChart2,
} from 'lucide-react';

export const Grades: React.FC = () => {
  const { grades, exams, classes, subjects, students, settings, addGrade, updateGrade, deleteGrade } = useEduTrack();

  const [search, setSearch] = useState('');
  const [selectedExamId, setSelectedExamId] = useState<string>('all');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeRecord | null>(null);
  const [deletingGrade, setDeletingGrade] = useState<GradeRecord | null>(null);
  const [viewingReportCardStudent, setViewingReportCardStudent] = useState<string | null>(null);

  // Form State
  const initialForm = {
    examId: exams[0]?.id || '',
    studentId: students[0]?.id || '',
    subjectId: subjects[0]?.id || '',
    marksObtained: 85,
    totalMarks: 100,
    remarks: 'Consistent academic performance and clear analytical depth.',
  };
  const [formData, setFormData] = useState(initialForm);

  // Helper to compute grade letter
  const computeGrade = (percentage: number): { letter: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F'; status: 'Pass' | 'Fail' } => {
    if (percentage >= 95) return { letter: 'A+', status: 'Pass' };
    if (percentage >= 85) return { letter: 'A', status: 'Pass' };
    if (percentage >= 75) return { letter: 'B+', status: 'Pass' };
    if (percentage >= 65) return { letter: 'B', status: 'Pass' };
    if (percentage >= 50) return { letter: 'C', status: 'Pass' };
    if (percentage >= 40) return { letter: 'D', status: 'Pass' };
    return { letter: 'F', status: 'Fail' };
  };

  // Grade distributions
  const gradeCounts = useMemo(() => {
    const counts = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'D/F': 0 };
    grades.forEach(g => {
      if (g.gradeLetter === 'A+') counts['A+']++;
      else if (g.gradeLetter === 'A') counts['A']++;
      else if (g.gradeLetter === 'B+') counts['B+']++;
      else if (g.gradeLetter === 'B') counts['B']++;
      else if (g.gradeLetter === 'C') counts['C']++;
      else counts['D/F']++;
    });
    return counts;
  }, [grades]);

  const avgCohortScore = useMemo(() => {
    if (grades.length === 0) return '0.0';
    const sum = grades.reduce((acc, g) => acc + g.percentage, 0);
    return (sum / grades.length).toFixed(1);
  }, [grades]);

  // Filtered grades
  const filteredGrades = useMemo(() => {
    return grades.filter((g) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        g.studentName.toLowerCase().includes(q) ||
        g.studentRoll.toLowerCase().includes(q) ||
        g.subjectName.toLowerCase().includes(q);

      const matchesExam = selectedExamId === 'all' || g.examId === selectedExamId;
      const matchesClass = selectedClassId === 'all' || g.classId === selectedClassId;

      return matchesSearch && matchesExam && matchesClass;
    });
  }, [grades, search, selectedExamId, selectedClassId]);

  const handleOpenAdd = () => {
    setFormData(initialForm);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (g: GradeRecord) => {
    setEditingGrade(g);
    setFormData({
      examId: g.examId,
      studentId: g.studentId,
      subjectId: g.subjectId,
      marksObtained: g.marksObtained,
      totalMarks: g.totalMarks,
      remarks: g.remarks || '',
    });
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === formData.studentId);
    const subject = subjects.find(sub => sub.id === formData.subjectId);
    const exam = exams.find(ex => ex.id === formData.examId);

    if (!student || !subject || !exam) return;

    const percentage = Math.round((formData.marksObtained / formData.totalMarks) * 100);
    const evaluated = computeGrade(percentage);

    addGrade({
      examId: exam.id,
      examName: exam.name,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentRoll: student.studentId,
      classId: student.classId,
      className: student.className,
      subjectId: subject.id,
      subjectName: subject.name,
      marksObtained: Number(formData.marksObtained),
      totalMarks: Number(formData.totalMarks),
      percentage,
      gradeLetter: evaluated.letter,
      status: evaluated.status,
      remarks: formData.remarks,
    });
    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGrade) return;

    const percentage = Math.round((formData.marksObtained / formData.totalMarks) * 100);
    const evaluated = computeGrade(percentage);

    updateGrade(editingGrade.id, {
      marksObtained: Number(formData.marksObtained),
      totalMarks: Number(formData.totalMarks),
      percentage,
      gradeLetter: evaluated.letter,
      status: evaluated.status,
      remarks: formData.remarks,
    });
    setEditingGrade(null);
  };

  // Student report card data
  const reportCardStudent = students.find(s => s.id === viewingReportCardStudent);
  const studentGrades = grades.filter(g => g.studentId === viewingReportCardStudent);
  const studentGpa = studentGrades.length > 0
    ? (studentGrades.reduce((a, b) => a + b.percentage, 0) / studentGrades.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Curriculum Assessments
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs font-mono text-slate-500">Cohort Average: {avgCohortScore}%</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Academic Grades & Examination Results
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Subject assessment scores, grading rubrics, distribution benchmarks, and official transcripts.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-102 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Grade</span>
        </button>
      </div>

      {/* Grade Distribution Bar & Summary Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Percentage</span>
          <p className="text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400 mt-2">{avgCohortScore}%</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Across all recorded subjects</span>
        </div>

        <div className="lg:col-span-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Grade Letter Distribution
            </span>
            <span className="text-slate-400 font-mono">{grades.length} Total Papers Graded</span>
          </div>

          <div className="grid grid-cols-6 gap-2 text-center text-xs font-mono">
            {Object.entries(gradeCounts).map(([letter, count]) => (
              <div key={letter} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block text-sm">{count}</span>
                <span className="text-[11px] text-slate-500 font-bold block mt-0.5">{letter}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student, roll number, or subject..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden font-medium"
          >
            <option value="all">All Examinations</option>
            {exams.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>

          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden font-medium"
          >
            <option value="all">All Cohorts</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.displayName}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          {filteredGrades.length} assessment records
        </div>
      </div>

      {/* Grades Table */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Cohort</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Exam Series</th>
                <th className="py-3.5 px-4">Marks Obtained</th>
                <th className="py-3.5 px-4">Grade</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredGrades.map((grade) => (
                <tr key={grade.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4">
                    <span
                      onClick={() => setViewingReportCardStudent(grade.studentId)}
                      className="font-bold text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer block"
                    >
                      {grade.studentName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{grade.studentRoll}</span>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {grade.className}
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {grade.subjectName}
                  </td>

                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                    {grade.examName}
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {grade.marksObtained}
                    </span>
                    <span className="text-slate-400"> / {grade.totalMarks} ({grade.percentage}%)</span>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold">
                    <span
                      className={`px-2 py-0.5 rounded-lg text-xs ${
                        grade.gradeLetter.startsWith('A')
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : grade.gradeLetter.startsWith('B')
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {grade.gradeLetter}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <Badge variant={grade.status === 'Pass' ? 'success' : 'danger'}>
                      {grade.status}
                    </Badge>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setViewingReportCardStudent(grade.studentId)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-semibold"
                        title="View Report Card"
                      >
                        Transcript
                      </button>
                      <button
                        onClick={() => handleOpenEdit(grade)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600"
                        title="Edit Score"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingGrade(grade)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600"
                        title="Delete"
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

      {/* Add / Edit Grade Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingGrade}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingGrade(null);
        }}
        title={editingGrade ? `Modify Grade: ${editingGrade.studentName}` : 'Record Exam Grade'}
        subtitle="Individual student score entry and academic appraisal remarks"
      >
        <form onSubmit={editingGrade ? handleSubmitEdit : handleSubmitAdd} className="space-y-4 text-xs">
          {!editingGrade && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Examination Period
                </label>
                <select
                  value={formData.examId}
                  onChange={(e) => setFormData({ ...formData, examId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  required
                >
                  {exams.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.term})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Student Name & Roll
                </label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  required
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.studentId} · {s.className})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Paper
                </label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  required
                >
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Marks Obtained *
              </label>
              <input
                type="number"
                min="0"
                max={formData.totalMarks}
                value={formData.marksObtained}
                onChange={(e) => setFormData({ ...formData, marksObtained: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Max Marks
              </label>
              <input
                type="number"
                min="1"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Instructor Remarks / Feedback
            </label>
            <textarea
              rows={2}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Provide commentary on student proof rigor and domain mastery..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingGrade(null);
              }}
              className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              {editingGrade ? 'Update Grade' : 'Save Grade'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Printable Report Card Transcript Modal */}
      {reportCardStudent && (
        <Modal
          isOpen={!!viewingReportCardStudent}
          onClose={() => setViewingReportCardStudent(null)}
          title="Official Academic Transcript"
          subtitle="Certified institutional grade sheet & comprehensive GPA"
          maxWidth="3xl"
        >
          <div className="space-y-6 text-xs p-2">
            {/* Header Document */}
            <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-blue-600 font-bold text-base">
                  <School className="w-5 h-5" />
                  <span>{settings.institutionName}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{settings.address}</p>
                <p className="text-slate-500 dark:text-slate-400">Academic Year: {settings.academicYear} · Term II Official Record</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">Transcript Serial</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">TRANS-{reportCardStudent.studentId}-2026</span>
              </div>
            </div>

            {/* Student metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div>
                <span className="text-slate-400 block font-medium">Student Name:</span>
                <strong className="text-slate-900 dark:text-white">{reportCardStudent.firstName} {reportCardStudent.lastName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Student Roll ID:</span>
                <strong className="font-mono text-slate-900 dark:text-white">{reportCardStudent.studentId}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Cohort / Grade:</span>
                <strong className="text-slate-900 dark:text-white">{reportCardStudent.className}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Attendance Rate:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{reportCardStudent.attendanceRate}%</strong>
              </div>
            </div>

            {/* Subjects Transcript Table */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-800 font-bold text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Examination Series</th>
                  <th className="py-2.5 px-3">Obtained / Max</th>
                  <th className="py-2.5 px-3">Percentage</th>
                  <th className="py-2.5 px-3">Grade</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {studentGrades.length > 0 ? (
                  studentGrades.map(sg => (
                    <tr key={sg.id}>
                      <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-white">{sg.subjectName}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-500">{sg.examName}</td>
                      <td className="py-2.5 px-3">{sg.marksObtained} / {sg.totalMarks}</td>
                      <td className="py-2.5 px-3 font-bold">{sg.percentage}%</td>
                      <td className="py-2.5 px-3 font-bold text-blue-600 dark:text-blue-400">{sg.gradeLetter}</td>
                      <td className="py-2.5 px-3 font-sans">
                        <Badge variant="success" size="sm">Pass</Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400 font-sans">
                      No official grade records posted for this student.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* GPA Summary */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cumulative Academic Standing</span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                  Academic Honours Status: <strong className="text-blue-600 dark:text-blue-400">Distinction</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-medium">Average Percentage</span>
                <p className="text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400">{studentGpa}%</p>
              </div>
            </div>

            {/* Print & Close */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Transcript</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingReportCardStudent(null)}
                className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingGrade}
        onClose={() => setDeletingGrade(null)}
        onConfirm={() => {
          if (deletingGrade) {
            deleteGrade(deletingGrade.id);
            setDeletingGrade(null);
          }
        }}
        title="Delete Grade Record"
        message="Are you sure you want to delete this recorded examination grade? This will alter cumulative student transcript GPA."
      />
    </div>
  );
};
