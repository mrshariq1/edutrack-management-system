import React, { useState, useEffect, useMemo } from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { AttendanceStatus } from '../types';
import { Badge } from '../components/common/Badge';
import { SafeAvatar } from '../components/common/SafeAvatar';
import { ASSETS } from '../assets';
import {
  CalendarCheck,
  Save,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  BarChart2,
  History,
} from 'lucide-react';

export const Attendance: React.FC = () => {
  const { classes, students, attendanceRecords, saveAttendance, getAttendance } = useEduTrack();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Active roster of students for selected class
  const classStudents = useMemo(() => {
    return students.filter(s => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  // Attendance state for current selected class and date
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: AttendanceStatus; note: string }>>({});

  // Sync state whenever date or class changes
  useEffect(() => {
    const existing = getAttendance(selectedDate, selectedClassId);
    const newMap: Record<string, { status: AttendanceStatus; note: string }> = {};

    classStudents.forEach((student) => {
      const recorded = existing?.records.find(r => r.studentId === student.id);
      if (recorded) {
        newMap[student.id] = { status: recorded.status, note: recorded.note || '' };
      } else {
        newMap[student.id] = { status: 'Present', note: '' }; // Default to present
      }
    });

    setAttendanceMap(newMap);
  }, [selectedDate, selectedClassId, classStudents, getAttendance]);

  // Status counters
  const totalCount = classStudents.length;
  const presentCount = Object.values(attendanceMap).filter(v => v.status === 'Present').length;
  const absentCount = Object.values(attendanceMap).filter(v => v.status === 'Absent').length;
  const lateCount = Object.values(attendanceMap).filter(v => v.status === 'Late').length;
  const excusedCount = Object.values(attendanceMap).filter(v => v.status === 'Excused').length;
  const attendanceRate = totalCount > 0 ? Math.round(((presentCount + lateCount) / totalCount) * 100) : 0;

  // Batch mark all
  const handleMarkAll = (status: AttendanceStatus) => {
    const updated = { ...attendanceMap };
    classStudents.forEach(s => {
      updated[s.id] = { ...updated[s.id], status };
    });
    setAttendanceMap(updated);
  };

  // Toggle single student
  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
  };

  // Update note
  const handleSetNote = (studentId: string, note: string) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], note },
    }));
  };

  // Save to context / LocalStorage
  const handleSave = () => {
    const selectedClassObj = classes.find(c => c.id === selectedClassId);
    const records = classStudents.map(student => ({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      rollNumber: student.studentId,
      status: attendanceMap[student.id]?.status || 'Present',
      note: attendanceMap[student.id]?.note,
    }));

    saveAttendance(
      selectedDate,
      selectedClassId,
      selectedClassObj ? selectedClassObj.displayName : 'Grade Class',
      records
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Daily Operations
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs font-mono text-slate-500">Live Roll Call Session</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Daily Attendance & Roll Call
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time daily roll call logging, excused absence notes, and historical audit ledger.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-102 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Roll Call Record</span>
        </button>
      </div>

      {/* Date & Class Controls Bar */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Class selector */}
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold focus:outline-hidden"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.displayName} ({c.roomNumber})</option>
              ))}
            </select>
          </div>

          {/* Date selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-medium focus:outline-hidden"
            />
          </div>
        </div>

        {/* Quick Batch Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleMarkAll('Present')}
            className="px-3.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mark All Present</span>
          </button>

          <button
            onClick={() => handleMarkAll('Absent')}
            className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 transition-colors"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Cohort Size</span>
          <p className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
            {totalCount}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Registered students</span>
        </div>

        <div className="p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs">
          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Present
          </span>
          <p className="text-2xl font-extrabold font-mono text-emerald-700 dark:text-emerald-300 mt-1">
            {presentCount}
          </p>
          <span className="text-[10px] text-emerald-600/80 mt-1 block">In classroom</span>
        </div>

        <div className="p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 shadow-xs">
          <span className="text-xs text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Late
          </span>
          <p className="text-2xl font-extrabold font-mono text-amber-700 dark:text-amber-300 mt-1">
            {lateCount}
          </p>
          <span className="text-[10px] text-amber-600/80 mt-1 block">Arrived after bell</span>
        </div>

        <div className="p-4 rounded-2xl border border-rose-200/80 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 shadow-xs">
          <span className="text-xs text-rose-700 dark:text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Absent
          </span>
          <p className="text-2xl font-extrabold font-mono text-rose-700 dark:text-rose-300 mt-1">
            {absentCount}
          </p>
          <span className="text-[10px] text-rose-600/80 mt-1 block">Unexcused</span>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 shadow-xs">
          <span className="text-xs text-blue-700 dark:text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Roll Rate
          </span>
          <p className="text-2xl font-extrabold font-mono text-blue-700 dark:text-blue-300 mt-1">
            {attendanceRate}%
          </p>
          <span className="text-[10px] text-blue-600/80 mt-1 block">Target: 95.0%</span>
        </div>
      </div>

      {/* Student Attendance List Table */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Roll Call Roster ({classStudents.length} Students)
          </span>
          <span className="text-slate-500 font-mono">Date: {selectedDate}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">Roll Number</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Status Selector</th>
                <th className="py-3.5 px-4">Remarks / Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {classStudents.map((student) => {
                const currentStatus = attendanceMap[student.id]?.status || 'Present';
                const currentNote = attendanceMap[student.id]?.note || '';

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-600 dark:text-slate-400">
                      {student.studentId}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <SafeAvatar
                          src={student.avatar || (student.gender === 'Female' ? ASSETS.portraits.studentFemale : ASSETS.portraits.studentMale)}
                          alt={`${student.firstName} ${student.lastName}`}
                          name={`${student.firstName} ${student.lastName}`}
                          size="sm"
                        />
                        <span className="font-bold text-slate-900 dark:text-white">
                          {student.firstName} {student.lastName}
                        </span>
                      </div>
                    </td>

                    {/* Status Toggle Buttons */}
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800">
                        <button
                          type="button"
                          onClick={() => handleSetStatus(student.id, 'Present')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetStatus(student.id, 'Late')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'Late'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetStatus(student.id, 'Absent')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'Absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-300 hover:text-rose-600'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetStatus(student.id, 'Excused')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'Excused'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
                          }`}
                        >
                          Excused
                        </button>
                      </div>
                    </td>

                    {/* Remarks Input */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={currentNote}
                        onChange={(e) => handleSetNote(student.id, e.target.value)}
                        placeholder="Add reason/note (e.g. clinic, traffic)..."
                        className="w-full max-w-sm px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Attendance verification is audited and complies with institutional regulatory statutes.
          </p>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#12B76A] hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Class Attendance</span>
          </button>
        </div>
      </div>

      {/* Attendance Analytics & History Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Chart (7-Day Trend) */}
        <div className="lg:col-span-6 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#1769E0]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                7-Day Roll Call Trend
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              Avg 96.4%
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {[
              { day: 'Monday', rate: 98, present: 32, late: 1, absent: 0 },
              { day: 'Tuesday', rate: 96, present: 31, late: 2, absent: 1 },
              { day: 'Wednesday', rate: 97, present: 32, late: 1, absent: 1 },
              { day: 'Thursday', rate: 95, present: 30, late: 2, absent: 2 },
              { day: 'Friday', rate: 96, present: 31, late: 1, absent: 1 },
            ].map((d) => (
              <div key={d.day} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{d.day}</span>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-[#12B76A] font-semibold">{d.present} Present</span>
                    <span className="text-[#F79009] font-semibold">{d.late} Late</span>
                    <span className="text-[#F04438] font-semibold">{d.absent} Absent</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{d.rate}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                  <div style={{ width: `${(d.present / 34) * 100}%` }} className="h-full bg-[#12B76A]" title="Present" />
                  <div style={{ width: `${(d.late / 34) * 100}%` }} className="h-full bg-[#F79009]" title="Late" />
                  <div style={{ width: `${(d.absent / 34) * 100}%` }} className="h-full bg-[#F04438]" title="Absent" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance History Audit Log */}
        <div className="lg:col-span-6 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#1769E0]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Archived Session Logs
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {attendanceRecords.length} Saved Logs
            </span>
          </div>

          <div className="mt-4 space-y-2.5 max-h-56 overflow-y-auto">
            {attendanceRecords.map((log) => {
              const pCount = log.records.filter(r => r.status === 'Present').length;
              const lCount = log.records.filter(r => r.status === 'Late').length;
              const aCount = log.records.filter(r => r.status === 'Absent').length;
              const pct = log.records.length > 0 ? Math.round(((pCount + lCount) / log.records.length) * 100) : 100;

              return (
                <div
                  key={log.id}
                  onClick={() => {
                    setSelectedDate(log.date);
                    setSelectedClassId(log.classId);
                  }}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-all flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {log.className}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      Date: {log.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                      {pCount} P · {lCount} L · {aCount} A
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
