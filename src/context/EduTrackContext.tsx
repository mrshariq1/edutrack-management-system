import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Student,
  Teacher,
  ClassItem,
  Subject,
  AttendanceRecord,
  Exam,
  ExamScheduleItem,
  GradeRecord,
  FeeInvoice,
  Parent,
  TimetableSlot,
  Notice,
  InstitutionSettings,
  AdminUser,
  NotificationItem,
  ToastMessage,
  AttendanceStatus,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_ATTENDANCE_TODAY,
  INITIAL_EXAMS,
  INITIAL_EXAM_SCHEDULE,
  INITIAL_GRADES,
  INITIAL_FEES,
  INITIAL_PARENTS,
  INITIAL_TIMETABLE,
  INITIAL_NOTICES,
  INITIAL_SETTINGS,
  INITIAL_ADMIN,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface GlobalSearchResult {
  type: 'student' | 'teacher' | 'class' | 'notice' | 'exam';
  id: string;
  title: string;
  subtitle: string;
  link: string;
}

interface EduTrackContextType {
  // Theme & Auth
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;

  // Data collections
  students: Student[];
  teachers: Teacher[];
  classes: ClassItem[];
  subjects: Subject[];
  attendanceRecords: AttendanceRecord[];
  exams: Exam[];
  examSchedules: ExamScheduleItem[];
  grades: GradeRecord[];
  fees: FeeInvoice[];
  parents: Parent[];
  timetable: TimetableSlot[];
  notices: Notice[];
  settings: InstitutionSettings;
  adminUser: AdminUser;
  notifications: NotificationItem[];
  toasts: ToastMessage[];

  // Toast actions
  addToast: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
  removeToast: (id: string) => void;

  // Students CRUD
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Teachers CRUD
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  // Classes CRUD
  addClass: (cls: Omit<ClassItem, 'id'>) => void;
  updateClass: (id: string, cls: Partial<ClassItem>) => void;
  deleteClass: (id: string) => void;

  // Subjects CRUD
  addSubject: (subj: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, subj: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Attendance
  saveAttendance: (date: string, classId: string, className: string, records: { studentId: string; studentName: string; rollNumber: string; status: AttendanceStatus; note?: string }[]) => void;
  getAttendance: (date: string, classId: string) => AttendanceRecord | undefined;

  // Exams CRUD
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, exam: Partial<Exam>) => void;
  deleteExam: (id: string) => void;

  // Grades CRUD
  addGrade: (grade: Omit<GradeRecord, 'id'>) => void;
  updateGrade: (id: string, grade: Partial<GradeRecord>) => void;
  deleteGrade: (id: string) => void;

  // Fees CRUD
  addFeeInvoice: (invoice: Omit<FeeInvoice, 'id'>) => void;
  updateFeeInvoice: (id: string, invoice: Partial<FeeInvoice>) => void;
  recordPayment: (id: string, amount: number, method: 'Card' | 'Bank Transfer' | 'Cash' | 'Online Portal') => void;
  deleteFeeInvoice: (id: string) => void;

  // Parents CRUD
  addParent: (parent: Omit<Parent, 'id'>) => void;
  updateParent: (id: string, parent: Partial<Parent>) => void;
  deleteParent: (id: string) => void;

  // Timetable CRUD
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  updateTimetableSlot: (id: string, slot: Partial<TimetableSlot>) => void;
  deleteTimetableSlot: (id: string) => void;

  // Notices CRUD
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  updateNotice: (id: string, notice: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;

  // Settings & Profile
  updateSettings: (newSettings: Partial<InstitutionSettings>) => void;
  updateAdminUser: (newUser: Partial<AdminUser>) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;

  // Global search & tools
  globalSearch: (query: string) => GlobalSearchResult[];
  resetToDefaultData: () => void;
  exportDatabaseJSON: () => void;
}

const EduTrackContext = createContext<EduTrackContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'edutrack_v1_';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
}

export const EduTrackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('edutrack_theme');
    return saved ? saved === 'dark' : false;
  });

  // Apply dark mode class to documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('edutrack_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('edutrack_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const auth = localStorage.getItem('edutrack_auth');
    return auth !== 'false'; // Default to true so client immediately sees the system, can logout anytime
  });

  const login = (email: string, pass: string): boolean => {
    if ((email === 'admin@edutrack.demo' && pass === 'admin123') || (email && pass.length >= 4)) {
      setIsAuthenticated(true);
      localStorage.setItem('edutrack_auth', 'true');
      addToast('success', `Welcome back to EduTrack, Administrator.`);
      return true;
    }
    addToast('error', 'Invalid demo credentials. Use admin@edutrack.demo / admin123');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('edutrack_auth', 'false');
    addToast('info', 'You have been signed out.');
  };

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Application Data States
  const [students, setStudents] = useState<Student[]>(() => loadFromStorage('students', INITIAL_STUDENTS));
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadFromStorage('teachers', INITIAL_TEACHERS));
  const [classes, setClasses] = useState<ClassItem[]>(() => loadFromStorage('classes', INITIAL_CLASSES));
  const [subjects, setSubjects] = useState<Subject[]>(() => loadFromStorage('subjects', INITIAL_SUBJECTS));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => loadFromStorage('attendance', [INITIAL_ATTENDANCE_TODAY]));
  const [exams, setExams] = useState<Exam[]>(() => loadFromStorage('exams', INITIAL_EXAMS));
  const [examSchedules, setExamSchedules] = useState<ExamScheduleItem[]>(() => loadFromStorage('examSchedules', INITIAL_EXAM_SCHEDULE));
  const [grades, setGrades] = useState<GradeRecord[]>(() => loadFromStorage('grades', INITIAL_GRADES));
  const [fees, setFees] = useState<FeeInvoice[]>(() => loadFromStorage('fees', INITIAL_FEES));
  const [parents, setParents] = useState<Parent[]>(() => loadFromStorage('parents', INITIAL_PARENTS));
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => loadFromStorage('timetable', INITIAL_TIMETABLE));
  const [notices, setNotices] = useState<Notice[]>(() => loadFromStorage('notices', INITIAL_NOTICES));
  const [settings, setSettings] = useState<InstitutionSettings>(() => loadFromStorage('settings', INITIAL_SETTINGS));
  const [adminUser, setAdminUser] = useState<AdminUser>(() => loadFromStorage('adminUser', INITIAL_ADMIN));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadFromStorage('notifications', INITIAL_NOTIFICATIONS));

  // Sync to storage
  useEffect(() => saveToStorage('students', students), [students]);
  useEffect(() => saveToStorage('teachers', teachers), [teachers]);
  useEffect(() => saveToStorage('classes', classes), [classes]);
  useEffect(() => saveToStorage('subjects', subjects), [subjects]);
  useEffect(() => saveToStorage('attendance', attendanceRecords), [attendanceRecords]);
  useEffect(() => saveToStorage('exams', exams), [exams]);
  useEffect(() => saveToStorage('examSchedules', examSchedules), [examSchedules]);
  useEffect(() => saveToStorage('grades', grades), [grades]);
  useEffect(() => saveToStorage('fees', fees), [fees]);
  useEffect(() => saveToStorage('parents', parents), [parents]);
  useEffect(() => saveToStorage('timetable', timetable), [timetable]);
  useEffect(() => saveToStorage('notices', notices), [notices]);
  useEffect(() => saveToStorage('settings', settings), [settings]);
  useEffect(() => saveToStorage('adminUser', adminUser), [adminUser]);
  useEffect(() => saveToStorage('notifications', notifications), [notifications]);

  // Notifications helper
  const addNotification = (title: string, message: string, type: NotificationItem['type'], link?: string) => {
    const item: NotificationItem = {
      id: 'notif_' + Date.now(),
      title,
      message,
      type,
      time: 'Just now',
      read: false,
      link,
    };
    setNotifications(prev => [item, ...prev]);
  };

  // STUDENTS CRUD
  const addStudent = (newStd: Omit<Student, 'id'>) => {
    const id = 'std-' + Date.now();
    const student: Student = { ...newStd, id };
    setStudents(prev => [student, ...prev]);
    // Update class count
    setClasses(prev => prev.map(c => c.id === student.classId ? { ...c, studentCount: c.studentCount + 1 } : c));
    addToast('success', `Student ${student.firstName} ${student.lastName} successfully enrolled.`);
    addNotification('New Student Enrolled', `${student.firstName} ${student.lastName} was registered in ${student.className}.`, 'student', '/students');
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    addToast('success', 'Student record updated successfully.');
  };

  const deleteStudent = (id: string) => {
    const target = students.find(s => s.id === id);
    if (!target) return;
    setStudents(prev => prev.filter(s => s.id !== id));
    setClasses(prev => prev.map(c => c.id === target.classId ? { ...c, studentCount: Math.max(0, c.studentCount - 1) } : c));
    addToast('info', `Student record for ${target.firstName} ${target.lastName} deleted.`);
  };

  // TEACHERS CRUD
  const addTeacher = (newTch: Omit<Teacher, 'id'>) => {
    const id = 'tch-' + Date.now();
    const teacher: Teacher = { ...newTch, id };
    setTeachers(prev => [teacher, ...prev]);
    addToast('success', `Teacher ${teacher.name} added to faculty registry.`);
  };

  const updateTeacher = (id: string, updated: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
    addToast('success', 'Teacher record updated successfully.');
  };

  const deleteTeacher = (id: string) => {
    const target = teachers.find(t => t.id === id);
    if (!target) return;
    setTeachers(prev => prev.filter(t => t.id !== id));
    addToast('info', `Faculty member ${target.name} removed.`);
  };

  // CLASSES CRUD
  const addClass = (newCls: Omit<ClassItem, 'id'>) => {
    const id = 'cls-' + Date.now();
    const cls: ClassItem = { ...newCls, id };
    setClasses(prev => [...prev, cls]);
    addToast('success', `Class ${cls.displayName} created successfully.`);
  };

  const updateClass = (id: string, updated: Partial<ClassItem>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
    addToast('success', 'Class details updated successfully.');
  };

  const deleteClass = (id: string) => {
    const target = classes.find(c => c.id === id);
    if (!target) return;
    setClasses(prev => prev.filter(c => c.id !== id));
    addToast('info', `Class ${target.displayName} deleted.`);
  };

  // SUBJECTS CRUD
  const addSubject = (newSub: Omit<Subject, 'id'>) => {
    const id = 'sub-' + Date.now();
    const sub: Subject = { ...newSub, id };
    setSubjects(prev => [...prev, sub]);
    addToast('success', `Subject ${sub.name} (${sub.code}) added.`);
  };

  const updateSubject = (id: string, updated: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    addToast('success', 'Subject updated successfully.');
  };

  const deleteSubject = (id: string) => {
    const target = subjects.find(s => s.id === id);
    if (!target) return;
    setSubjects(prev => prev.filter(s => s.id !== id));
    addToast('info', `Subject ${target.name} removed.`);
  };

  // ATTENDANCE
  const saveAttendance = (
    date: string,
    classId: string,
    className: string,
    records: { studentId: string; studentName: string; rollNumber: string; status: AttendanceStatus; note?: string }[]
  ) => {
    const existingIndex = attendanceRecords.findIndex(a => a.date === date && a.classId === classId);
    const newRecord: AttendanceRecord = {
      id: existingIndex >= 0 ? attendanceRecords[existingIndex].id : 'att-' + Date.now(),
      date,
      classId,
      className,
      markedBy: adminUser.name,
      records,
    };

    if (existingIndex >= 0) {
      setAttendanceRecords(prev => {
        const copy = [...prev];
        copy[existingIndex] = newRecord;
        return copy;
      });
    } else {
      setAttendanceRecords(prev => [newRecord, ...prev]);
    }

    addToast('success', `Attendance for ${className} on ${date} saved.`);
    addNotification('Attendance Logged', `Attendance for ${className} was saved with ${records.length} student entries.`, 'attendance', '/attendance');
  };

  const getAttendance = (date: string, classId: string): AttendanceRecord | undefined => {
    return attendanceRecords.find(a => a.date === date && a.classId === classId);
  };

  // EXAMS CRUD
  const addExam = (newExam: Omit<Exam, 'id'>) => {
    const id = 'ex-' + Date.now();
    const ex: Exam = { ...newExam, id };
    setExams(prev => [ex, ...prev]);
    addToast('success', `Exam "${ex.name}" scheduled successfully.`);
    addNotification('New Exam Scheduled', `${ex.name} (${ex.term}) scheduled from ${ex.startDate}.`, 'exam', '/exams');
  };

  const updateExam = (id: string, updated: Partial<Exam>) => {
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
    addToast('success', 'Examination schedule updated.');
  };

  const deleteExam = (id: string) => {
    const target = exams.find(e => e.id === id);
    if (!target) return;
    setExams(prev => prev.filter(e => e.id !== id));
    setExamSchedules(prev => prev.filter(s => s.examId !== id));
    addToast('info', `Exam ${target.name} removed.`);
  };

  // GRADES CRUD
  const addGrade = (newGrd: Omit<GradeRecord, 'id'>) => {
    const id = 'grd-' + Date.now();
    const grd: GradeRecord = { ...newGrd, id };
    setGrades(prev => [grd, ...prev]);
    addToast('success', `Grade record for ${grd.studentName} recorded.`);
  };

  const updateGrade = (id: string, updated: Partial<GradeRecord>) => {
    setGrades(prev => prev.map(g => g.id === id ? { ...g, ...updated } : g));
    addToast('success', 'Grade record modified successfully.');
  };

  const deleteGrade = (id: string) => {
    setGrades(prev => prev.filter(g => g.id !== id));
    addToast('info', 'Grade entry removed.');
  };

  // FEES CRUD
  const addFeeInvoice = (newFee: Omit<FeeInvoice, 'id'>) => {
    const id = 'fee-' + Date.now();
    const fee: FeeInvoice = { ...newFee, id };
    setFees(prev => [fee, ...prev]);
    addToast('success', `Fee Invoice ${fee.invoiceNumber} generated.`);
  };

  const updateFeeInvoice = (id: string, updated: Partial<FeeInvoice>) => {
    setFees(prev => prev.map(f => f.id === id ? { ...f, ...updated } : f));
    addToast('success', 'Invoice details updated.');
  };

  const recordPayment = (
    id: string,
    amount: number,
    method: 'Card' | 'Bank Transfer' | 'Cash' | 'Online Portal'
  ) => {
    setFees(prev => prev.map(f => {
      if (f.id !== id) return f;
      const newPaid = f.paidAmount + amount;
      const newBal = Math.max(0, f.amount - newPaid);
      const newStatus = newBal === 0 ? 'Paid' : 'Pending';
      return {
        ...f,
        paidAmount: newPaid,
        balance: newBal,
        status: newStatus,
        paymentMethod: method,
        paidDate: new Date().toISOString().split('T')[0],
      };
    }));

    // Also update student feeStatus if fully paid
    const targetFee = fees.find(f => f.id === id);
    if (targetFee) {
      if (targetFee.amount <= targetFee.paidAmount + amount) {
        setStudents(prev => prev.map(s => s.id === targetFee.studentId ? { ...s, feeStatus: 'Paid' } : s));
      }
      addNotification('Fee Payment Settled', `$${amount.toLocaleString()} received for ${targetFee.studentName} via ${method}.`, 'fee', '/fees');
    }

    addToast('success', `Payment of $${amount.toLocaleString()} recorded successfully.`);
  };

  const deleteFeeInvoice = (id: string) => {
    setFees(prev => prev.filter(f => f.id !== id));
    addToast('info', 'Fee record deleted.');
  };

  // PARENTS CRUD
  const addParent = (newPar: Omit<Parent, 'id'>) => {
    const id = 'par-' + Date.now();
    const par: Parent = { ...newPar, id };
    setParents(prev => [par, ...prev]);
    addToast('success', `Parent profile for ${par.name} created.`);
  };

  const updateParent = (id: string, updated: Partial<Parent>) => {
    setParents(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    addToast('success', 'Parent profile updated.');
  };

  const deleteParent = (id: string) => {
    setParents(prev => prev.filter(p => p.id !== id));
    addToast('info', 'Parent record removed.');
  };

  // TIMETABLE CRUD
  const addTimetableSlot = (newSlot: Omit<TimetableSlot, 'id'>) => {
    const id = 'tt-' + Date.now();
    const slot: TimetableSlot = { ...newSlot, id };
    setTimetable(prev => [...prev, slot]);
    addToast('success', `Schedule slot added for ${slot.day}.`);
  };

  const updateTimetableSlot = (id: string, updated: Partial<TimetableSlot>) => {
    setTimetable(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
    addToast('success', 'Schedule slot modified.');
  };

  const deleteTimetableSlot = (id: string) => {
    setTimetable(prev => prev.filter(t => t.id !== id));
    addToast('info', 'Timetable slot removed.');
  };

  // NOTICES CRUD
  const addNotice = (newNotice: Omit<Notice, 'id'>) => {
    const id = 'not-' + Date.now();
    const not: Notice = { ...newNotice, id };
    setNotices(prev => [not, ...prev]);
    addToast('success', `Notice "${not.title}" published.`);
    addNotification('New Circular Published', not.title, 'notice', '/notices');
  };

  const updateNotice = (id: string, updated: Partial<Notice>) => {
    setNotices(prev => prev.map(n => n.id === id ? { ...n, ...updated } : n));
    addToast('success', 'Notice circular updated.');
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
    addToast('info', 'Notice archived/deleted.');
  };

  // SETTINGS & PROFILE
  const updateSettings = (newSettings: Partial<InstitutionSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addToast('success', 'Institution settings saved.');
  };

  const updateAdminUser = (newUser: Partial<AdminUser>) => {
    setAdminUser(prev => ({ ...prev, ...newUser }));
    addToast('success', 'Admin profile changes saved.');
  };

  // NOTIFICATIONS
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('info', 'All notifications marked as read.');
  };

  const clearNotifications = () => {
    setNotifications([]);
    addToast('info', 'Notification tray cleared.');
  };

  // GLOBAL SEARCH
  const globalSearch = useCallback((query: string): GlobalSearchResult[] => {
    if (!query || query.trim().length < 2) return [];
    const q = query.toLowerCase().trim();
    const results: GlobalSearchResult[] = [];

    // Search students
    students.forEach(s => {
      const full = `${s.firstName} ${s.lastName}`.toLowerCase();
      if (full.includes(q) || s.studentId.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)) {
        results.push({
          type: 'student',
          id: s.id,
          title: `${s.firstName} ${s.lastName} (${s.studentId})`,
          subtitle: `Student · ${s.className} · ${s.status}`,
          link: '/students',
        });
      }
    });

    // Search teachers
    teachers.forEach(t => {
      if (t.name.toLowerCase().includes(q) || t.teacherId.toLowerCase().includes(q) || t.department.toLowerCase().includes(q)) {
        results.push({
          type: 'teacher',
          id: t.id,
          title: t.name,
          subtitle: `Faculty · ${t.department} · ${t.subjects.join(', ')}`,
          link: '/teachers',
        });
      }
    });

    // Search classes
    classes.forEach(c => {
      if (c.displayName.toLowerCase().includes(q) || c.roomNumber.toLowerCase().includes(q) || c.classTeacherName.toLowerCase().includes(q)) {
        results.push({
          type: 'class',
          id: c.id,
          title: c.displayName,
          subtitle: `Class · ${c.roomNumber} · Teacher: ${c.classTeacherName}`,
          link: '/classes',
        });
      }
    });

    // Search notices
    notices.forEach(n => {
      if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
        results.push({
          type: 'notice',
          id: n.id,
          title: n.title,
          subtitle: `Circular · ${n.category} · Priority: ${n.priority}`,
          link: '/notices',
        });
      }
    });

    return results.slice(0, 8);
  }, [students, teachers, classes, notices]);

  // RESET TO DEFAULT DEMO DATA
  const resetToDefaultData = () => {
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setClasses(INITIAL_CLASSES);
    setSubjects(INITIAL_SUBJECTS);
    setAttendanceRecords([INITIAL_ATTENDANCE_TODAY]);
    setExams(INITIAL_EXAMS);
    setExamSchedules(INITIAL_EXAM_SCHEDULE);
    setGrades(INITIAL_GRADES);
    setFees(INITIAL_FEES);
    setParents(INITIAL_PARENTS);
    setTimetable(INITIAL_TIMETABLE);
    setNotices(INITIAL_NOTICES);
    setSettings(INITIAL_SETTINGS);
    setAdminUser(INITIAL_ADMIN);
    setNotifications(INITIAL_NOTIFICATIONS);

    // Clear local storage prefix
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(LOCAL_STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });

    addToast('success', 'Demo data successfully reset to fresh defaults.');
  };

  // EXPORT JSON
  const exportDatabaseJSON = () => {
    const payload = {
      institution: settings,
      admin: adminUser,
      students,
      teachers,
      classes,
      subjects,
      attendance: attendanceRecords,
      exams,
      grades,
      fees,
      parents,
      timetable,
      notices,
      exportTimestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `edutrack-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Institutional data backup exported.');
  };

  return (
    <EduTrackContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        isAuthenticated,
        login,
        logout,
        students,
        teachers,
        classes,
        subjects,
        attendanceRecords,
        exams,
        examSchedules,
        grades,
        fees,
        parents,
        timetable,
        notices,
        settings,
        adminUser,
        notifications,
        toasts,
        addToast,
        removeToast,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addClass,
        updateClass,
        deleteClass,
        addSubject,
        updateSubject,
        deleteSubject,
        saveAttendance,
        getAttendance,
        addExam,
        updateExam,
        deleteExam,
        addGrade,
        updateGrade,
        deleteGrade,
        addFeeInvoice,
        updateFeeInvoice,
        recordPayment,
        deleteFeeInvoice,
        addParent,
        updateParent,
        deleteParent,
        addTimetableSlot,
        updateTimetableSlot,
        deleteTimetableSlot,
        addNotice,
        updateNotice,
        deleteNotice,
        updateSettings,
        updateAdminUser,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        globalSearch,
        resetToDefaultData,
        exportDatabaseJSON,
      }}
    >
      {children}
    </EduTrackContext.Provider>
  );
};

export const useEduTrack = (): EduTrackContextType => {
  const context = useContext(EduTrackContext);
  if (!context) {
    throw new Error('useEduTrack must be used within an EduTrackProvider');
  }
  return context;
};
