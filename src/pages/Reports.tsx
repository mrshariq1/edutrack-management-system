import React, { useState } from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { Modal } from '../components/common/Modal';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Layers,
  Users,
  CreditCard,
  GraduationCap,
  CalendarCheck,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';

export const Reports: React.FC = () => {
  const { students, teachers, classes, fees, grades, settings, addToast } = useEduTrack();

  const [activeReport, setActiveReport] = useState<'enrollment' | 'attendance' | 'fees' | 'academic' | 'teachers'>('enrollment');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Compute values
  const totalRevenue = fees.reduce((sum, f) => sum + f.amount, 0);
  const totalCollected = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalPending = fees.reduce((sum, f) => sum + f.balance, 0);

  const avgAttendance = students.length > 0
    ? (students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length).toFixed(1)
    : '0';

  const avgGrade = grades.length > 0
    ? (grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length).toFixed(1)
    : '0';

  // Export to CSV function
  const handleExportCSV = () => {
    let csvContent = '';
    let filename = `edutrack-${activeReport}-report.csv`;

    if (activeReport === 'enrollment') {
      csvContent = 'Student ID,Name,Class,Gender,Parent,Fee Status,Attendance Rate,Status\n';
      students.forEach(s => {
        csvContent += `"${s.studentId}","${s.firstName} ${s.lastName}","${s.className}","${s.gender}","${s.parentName}","${s.feeStatus}","${s.attendanceRate}%","${s.status}"\n`;
      });
    } else if (activeReport === 'fees') {
      csvContent = 'Invoice Number,Student Name,Class,Description,Amount,Paid Amount,Balance,Status,Due Date\n';
      fees.forEach(f => {
        csvContent += `"${f.invoiceNumber}","${f.studentName}","${f.className}","${f.title}","${f.amount}","${f.paidAmount}","${f.balance}","${f.status}","${f.dueDate}"\n`;
      });
    } else if (activeReport === 'academic') {
      csvContent = 'Student Name,Roll No,Subject,Exam Series,Marks Obtained,Total Marks,Percentage,Grade,Status\n';
      grades.forEach(g => {
        csvContent += `"${g.studentName}","${g.studentRoll}","${g.subjectName}","${g.examName}","${g.marksObtained}","${g.totalMarks}","${g.percentage}%","${g.gradeLetter}","${g.status}"\n`;
      });
    } else if (activeReport === 'teachers') {
      csvContent = 'Teacher ID,Name,Department,Email,Subjects,Classes,Status,Salary\n';
      teachers.forEach(t => {
        csvContent += `"${t.teacherId}","${t.name}","${t.department}","${t.email}","${t.subjects.join('; ')}","${t.classes.join('; ')}","${t.status}","${t.salary}"\n`;
      });
    } else {
      csvContent = 'Student Name,Class,Attendance Rate\n';
      students.forEach(s => {
        csvContent += `"${s.firstName} ${s.lastName}","${s.className}","${s.attendanceRate}%"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    addToast('success', `${filename} generated and downloaded.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Institutional MIS Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Data aggregation for academic compliance, financial reconciliation, and enrollment trends.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Category Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs overflow-x-auto pb-1">
        <button
          onClick={() => setActiveReport('enrollment')}
          className={`pb-2.5 px-3 font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeReport === 'enrollment'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Enrollment & Demographic
        </button>
        <button
          onClick={() => setActiveReport('attendance')}
          className={`pb-2.5 px-3 font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeReport === 'attendance'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Attendance Discipline
        </button>
        <button
          onClick={() => setActiveReport('fees')}
          className={`pb-2.5 px-3 font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeReport === 'fees'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Fee Collection & Bursar
        </button>
        <button
          onClick={() => setActiveReport('academic')}
          className={`pb-2.5 px-3 font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeReport === 'academic'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Academic Performance
        </button>
        <button
          onClick={() => setActiveReport('teachers')}
          className={`pb-2.5 px-3 font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeReport === 'teachers'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Faculty Roster & Workload
        </button>
      </div>

      {/* Report 1: Enrollment */}
      {activeReport === 'enrollment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-500">Active Students</span>
              <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">{students.length}</p>
            </div>
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-500">Gender Ratio</span>
              <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
                {students.filter(s => s.gender === 'Female').length}F / {students.filter(s => s.gender === 'Male').length}M
              </p>
            </div>
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-500">Active Cohorts</span>
              <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{classes.length}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white">
              Enrollment Summary by Classroom Section
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Homeroom Teacher</th>
                    <th className="py-3 px-4">Enrolled Students</th>
                    <th className="py-3 px-4">Capacity</th>
                    <th className="py-3 px-4">Utilization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {classes.map(c => {
                    const count = students.filter(s => s.classId === c.id).length;
                    return (
                      <tr key={c.id}>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{c.displayName}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{c.classTeacherName}</td>
                        <td className="py-3 px-4 font-mono">{count} students</td>
                        <td className="py-3 px-4 font-mono">{c.capacity}</td>
                        <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                          {Math.round((count / c.capacity) * 100)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Report 2: Attendance */}
      {activeReport === 'attendance' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Institution Average</span>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-4xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{avgAttendance}%</span>
              <span className="text-xs text-slate-500">Average student attendance consistency this term</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white">
              Student Attendance Leaderboard
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Cohort</th>
                    <th className="py-3 px-4">Attendance Rate</th>
                    <th className="py-3 px-4">Standing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {students.slice(0, 8).map(st => (
                    <tr key={st.id}>
                      <td className="py-3 px-4 font-sans font-semibold text-slate-900 dark:text-white">{st.firstName} {st.lastName}</td>
                      <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-300">{st.className}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{st.attendanceRate}%</td>
                      <td className="py-3 px-4 font-sans">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          st.attendanceRate >= 95 ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300' : 'text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {st.attendanceRate >= 95 ? 'Exemplary' : 'Regular'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Report 3: Fees */}
      {activeReport === 'fees' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-500">Total Billed</span>
              <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-5 rounded-xl border border-emerald-100 dark:border-emerald-950 bg-emerald-50/40 dark:bg-emerald-950/20">
              <span className="text-xs text-emerald-700 dark:text-emerald-400">Total Remitted</span>
              <p className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-300 mt-1">${totalCollected.toLocaleString()}</p>
            </div>
            <div className="p-5 rounded-xl border border-amber-100 dark:border-amber-950 bg-amber-50/40 dark:bg-amber-950/20">
              <span className="text-xs text-amber-700 dark:text-amber-400">Receivable Balance</span>
              <p className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-300 mt-1">${totalPending.toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Reconciliation Status</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              All collections are audited against the Massachusetts Department of Elementary & Secondary Education standards.
            </p>
          </div>
        </div>
      )}

      {/* Report 4: Academic */}
      {activeReport === 'academic' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Cohort Mean Percentage</span>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-4xl font-extrabold font-mono text-blue-600 dark:text-blue-400">{avgGrade}%</span>
              <span className="text-xs text-slate-500">Benchmark score across midterm exam series</span>
            </div>
          </div>
        </div>
      )}

      {/* Report 5: Teachers */}
      {activeReport === 'teachers' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white">
              Faculty Workload & Departmental Allocation
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Faculty Member</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Assigned Cohorts</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {teachers.map(t => (
                    <tr key={t.id}>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{t.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{t.department}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{t.classes.join(', ')}</td>
                      <td className="py-3 px-4 text-emerald-600 font-medium">{t.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Print Preview Modal */}
      {isPrintModalOpen && (
        <Modal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          title="Print Executive Report Preview"
          subtitle="Ready for board review, accreditation audit, and print reproduction"
          maxWidth="3xl"
        >
          <div className="space-y-6 text-xs p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950">
            <div className="text-center border-b pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{settings.institutionName}</h2>
              <p className="text-slate-500">{settings.tagline}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-1">Official Executive Report · Generated {new Date().toLocaleDateString()}</p>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded bg-slate-50 dark:bg-slate-900">
                <span className="text-slate-400 block">Enrolled Students</span>
                <strong className="text-base font-mono">{students.length}</strong>
              </div>
              <div className="p-3 rounded bg-slate-50 dark:bg-slate-900">
                <span className="text-slate-400 block">Faculty Members</span>
                <strong className="text-base font-mono">{teachers.length}</strong>
              </div>
              <div className="p-3 rounded bg-slate-50 dark:bg-slate-900">
                <span className="text-slate-400 block">Attendance Rate</span>
                <strong className="text-base font-mono">{avgAttendance}%</strong>
              </div>
              <div className="p-3 rounded bg-slate-50 dark:bg-slate-900">
                <span className="text-slate-400 block">Revenue Collected</span>
                <strong className="text-base font-mono">${(totalCollected / 1000).toFixed(1)}k</strong>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Confirm & Print Document</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 rounded-lg border font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
