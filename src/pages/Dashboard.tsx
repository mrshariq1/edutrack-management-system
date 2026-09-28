import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEduTrack } from '../context/EduTrackContext';
import { Badge } from '../components/common/Badge';
import { ASSETS } from '../assets';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  Plus,
  ArrowRight,
  Clock,
  FileSpreadsheet,
  Megaphone,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight,
  School,
  AlertCircle,
  Activity,
} from 'lucide-react';
import { QuickActionModal } from '../components/common/QuickActionModal';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    students,
    teachers,
    classes,
    fees,
    notices,
    exams,
    timetable,
    adminUser,
    attendanceRecords,
    settings,
    notifications,
  } = useEduTrack();

  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [selectedChartPeriod, setSelectedChartPeriod] = useState<'term' | 'annual'>('term');

  // Compute metrics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter(t => t.status === 'Active').length;

  // Compute fee stats
  const totalCollected = fees.reduce((acc, f) => acc + f.paidAmount, 0);
  const totalPending = fees.reduce((acc, f) => acc + f.balance, 0);
  const collectionRate = totalCollected + totalPending > 0 ? Math.round((totalCollected / (totalCollected + totalPending)) * 100) : 100;

  // Attendance metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = attendanceRecords.find(a => a.date === todayStr);
  const avgAttendance = students.reduce((acc, s) => acc + s.attendanceRate, 0) / (students.length || 1);
  const todayAttendanceRate = todayRecord && todayRecord.records.length > 0
    ? Math.round((todayRecord.records.filter(r => r.status === 'Present' || r.status === 'Late').length / todayRecord.records.length) * 100)
    : Math.round(avgAttendance);

  // Upcoming exams
  const upcomingExams = exams.filter(e => e.status === 'Upcoming' || e.status === 'Ongoing').slice(0, 3);

  // Today's timetable slots (Monday default)
  const todaySlots = timetable.filter(t => t.day === 'Monday').slice(0, 4);

  // Recent notices
  const recentNotices = notices.slice(0, 3);

  // Grade level distribution
  const gradeDistribution = [
    { grade: 'Grade 9', current: students.filter(s => s.className.includes('Grade 9')).length, target: 40, color: '#3B82F6' },
    { grade: 'Grade 10', current: students.filter(s => s.className.includes('Grade 10')).length, target: 40, color: '#2563EB' },
    { grade: 'Grade 11', current: students.filter(s => s.className.includes('Grade 11')).length, target: 35, color: '#1D4ED8' },
    { grade: 'Grade 12', current: students.filter(s => s.className.includes('Grade 12')).length, target: 35, color: '#1E40AF' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F2747] via-[#123157] to-[#1769E0] text-white p-6 sm:p-8 shadow-xl border border-white/10">
        {/* Subtle Campus Photography Texture Overlay */}
        <div className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none">
          <img
            src={ASSETS.dashboardBanner}
            alt="Campus"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Ambient Gradient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-semibold tracking-wide mb-3 backdrop-blur-md">
              <Calendar className="w-3.5 h-3.5 text-blue-200" />
              <span>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span>•</span>
              <span>{settings.academicYear} Active Session</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white text-balance font-sans">
              Good Morning, Admin 👋
            </h1>

            <p className="mt-2 text-sm text-blue-100 leading-relaxed text-balance">
              Here’s what&apos;s happening across your institution today. Real-time updates on student rosters, faculty sessions, and fee collections.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsQuickActionOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#0F2747] hover:bg-blue-50 text-xs font-bold shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#1769E0]" />
              <span>Quick Action</span>
            </button>
            <button
              onClick={() => navigate('/attendance')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md transition-all hover:scale-102 border border-white/20 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4 text-[#12B76A]" />
              <span>Daily Roll Call</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Premium KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Students */}
        <div
          onClick={() => navigate('/students')}
          className="group relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/95 p-5 shadow-xs transition-all hover:shadow-md hover:border-blue-400 dark:hover:border-blue-700 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Students
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
              {totalStudents}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" /> +4.2%
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>{activeStudents} enrolled in cohorts</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
              View <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Stat 2: Total Teachers */}
        <div
          onClick={() => navigate('/teachers')}
          className="group relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/95 p-5 shadow-xs transition-all hover:shadow-md hover:border-blue-400 dark:hover:border-blue-700 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Faculty
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
              {totalTeachers}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              100% quota
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>{activeTeachers} active instructors</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
              Faculty <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Stat 3: Today's Attendance */}
        <div
          onClick={() => navigate('/attendance')}
          className="group relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/95 p-5 shadow-xs transition-all hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-700 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Today&apos;s Attendance
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
              {todayAttendanceRate}%
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              +1.8% vs avg
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Historical mean: 95.8%</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
              Roster <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Stat 4: Collected Revenue */}
        <div
          onClick={() => navigate('/fees')}
          className="group relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/95 p-5 shadow-xs transition-all hover:shadow-md hover:border-blue-400 dark:hover:border-blue-700 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Monthly Revenue
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
              ${(totalCollected / 1000).toFixed(1)}k
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
              {collectionRate}% settled
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>${(totalPending / 1000).toFixed(1)}k pending</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
              Billing <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Analytics Grid (Left 8 Cols / Right 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Charts & Analytics */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section A: Student Enrollment & Capacity Visualizer */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Student Enrollment & Capacity Distribution
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Current headcount vs target capacity across secondary grade tiers
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedChartPeriod('term')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    selectedChartPeriod === 'term'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Active Term
                </button>
                <button
                  onClick={() => setSelectedChartPeriod('annual')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    selectedChartPeriod === 'annual'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Full Year
                </button>
              </div>
            </div>

            {/* Custom SVG Bar Graph */}
            <div className="mt-6">
              <div className="grid grid-cols-4 gap-4 h-48 items-end px-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                {gradeDistribution.map((item) => {
                  const percent = Math.min(100, Math.round((item.current / item.target) * 100));
                  return (
                    <div key={item.grade} className="flex flex-col items-center h-full justify-end group">
                      <div className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.current}/{item.target}
                      </div>
                      <div className="w-full max-w-[54px] rounded-t-xl bg-slate-100 dark:bg-slate-800/80 h-full relative overflow-hidden flex items-end">
                        <div
                          className="w-full rounded-t-xl transition-all duration-700 ease-out group-hover:brightness-110"
                          style={{
                            height: `${percent}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">
                        {item.grade}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {percent}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom aggregate metrics */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[11px] text-slate-400 block font-medium">Cohort Capacity</span>
                <span className="text-base font-bold font-mono text-slate-900 dark:text-white">180</span>
              </div>
              <div className="p-2 rounded-xl bg-blue-50/50 dark:bg-blue-950/20">
                <span className="text-[11px] text-blue-600 dark:text-blue-400 block font-medium">Enrolled</span>
                <span className="text-base font-bold font-mono text-blue-600 dark:text-blue-400">{totalStudents}</span>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20">
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-medium">Available</span>
                <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">{180 - totalStudents}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[11px] text-slate-400 block font-medium">Capacity Used</span>
                <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                  {Math.round((totalStudents / 180) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Section B: Attendance Overview & Fee Collection Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Attendance Overview Donut */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Attendance Overview
                  </h3>
                  <button
                    onClick={() => navigate('/attendance')}
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Roll Call
                  </button>
                </div>

                <div className="py-6 flex items-center justify-center gap-6">
                  {/* SVG Donut */}
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      {/* Background circle */}
                      <path
                        className="text-slate-100 dark:text-slate-800"
                        strokeWidth="3.8"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Present segment (92%) */}
                      <path
                        className="text-emerald-500"
                        strokeDasharray="92, 100"
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                        {todayAttendanceRate}%
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Present</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-slate-600 dark:text-slate-300">Present (92%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-slate-600 dark:text-slate-300">Late (5%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="text-slate-600 dark:text-slate-300">Absent (3%)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Updated 15 mins ago</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">All classes filed</span>
              </div>
            </div>

            {/* Fee Collection & Revenue Progress */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Fee Collection Trajectory
                  </h3>
                  <button
                    onClick={() => navigate('/fees')}
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Bursar Ledger
                  </button>
                </div>

                <div className="py-4 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                        ${(totalCollected / 1000).toFixed(1)}k
                      </span>
                      <span className="text-xs text-slate-400 ml-1">
                        / ${( (totalCollected + totalPending) / 1000 ).toFixed(1)}k billed
                      </span>
                    </div>
                    <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      {collectionRate}% Collected
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-700"
                        style={{ width: `${collectionRate}%` }}
                        title="Paid"
                      />
                      <div
                        className="h-full bg-amber-500 transition-all duration-700"
                        style={{ width: `${100 - collectionRate}%` }}
                        title="Pending"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Settled: ${totalCollected.toLocaleString()}</span>
                      <span>Pending: ${totalPending.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Overdue Accounts:</span>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                      {fees.filter(f => f.status === 'Overdue').length} pending warning notices
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Final due date: Oct 15</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">ACH & Cards accepted</span>
              </div>
            </div>
          </div>

          {/* Section C: Top Performing Classes Leaderboard */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Academic Performance & Discipline Leaderboard
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Class cohorts rated by average exam marks and daily roll call attendance
                </p>
              </div>
              <button
                onClick={() => navigate('/classes')}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                All Cohorts <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {classes.slice(0, 4).map((cls, idx) => (
                <div key={cls.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                      idx === 0
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 ring-2 ring-amber-400/30'
                        : idx === 1
                        ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300'
                    }`}>
                      #{idx + 1}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {cls.displayName}
                        <span className="text-[10px] font-mono text-slate-400">({cls.roomNumber})</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Class Teacher: {cls.classTeacherName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs font-mono">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-slate-400 block font-sans">Enrolled</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{cls.studentCount} students</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-sans">Attendance</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">97.8%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Timetable, Upcoming Exams, Notices, Activity */}
        <div className="lg:col-span-4 space-y-6">
          {/* Today's Schedule Live Preview */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Today&apos;s Live Timetable
                </h3>
              </div>
              <button
                onClick={() => navigate('/timetable')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Full Grid
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {todaySlots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 space-y-1 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {slot.subjectName}
                    </span>
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      P{slot.period}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{slot.teacherName}</span>
                    <span className="font-mono">{slot.startTime}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {slot.className} · {slot.room}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Examinations */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Upcoming Examinations
                </h3>
              </div>
              <button
                onClick={() => navigate('/exams')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Schedule
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {upcomingExams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {exam.name}
                    </h4>
                    <Badge variant={exam.status === 'Ongoing' ? 'warning' : 'primary'} size="sm">
                      {exam.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Term: {exam.term} · {exam.examType}
                  </p>
                  <p className="text-[10px] font-mono text-purple-600 dark:text-purple-400 mt-1 font-semibold">
                    Commences: {exam.startDate}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Circulars / Notices */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Recent Circulars
                </h3>
              </div>
              <button
                onClick={() => navigate('/notices')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Notice Board
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {recentNotices.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => navigate('/notices')}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {notice.category}
                    </span>
                    <Badge
                      variant={
                        notice.priority === 'Urgent'
                          ? 'danger'
                          : notice.priority === 'High'
                          ? 'warning'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {notice.priority}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {notice.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {notice.content}
                  </p>
                  <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between font-mono">
                    <span>{notice.publishDate}</span>
                    <span>Audience: {notice.targetAudience}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Operational Activities */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Recent Activities
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                Live Audit
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {notifications.slice(0, 4).map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => activity.link && navigate(activity.link)}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 cursor-pointer transition-all flex items-start gap-3 group"
                >
                  <div className="mt-0.5 w-7 h-7 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center shrink-0">
                    {activity.type === 'student' && <Users className="w-3.5 h-3.5" />}
                    {activity.type === 'fee' && <CreditCard className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                    {activity.type === 'attendance' && <CalendarCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    {activity.type === 'exam' && <FileSpreadsheet className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                    {activity.type === 'notice' && <Megaphone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {activity.title}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {activity.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
      />
    </div>
  );
};
