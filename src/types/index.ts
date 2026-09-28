export type Gender = 'Male' | 'Female' | 'Other';
export type StudentStatus = 'Active' | 'Inactive' | 'Suspended' | 'Alumni';
export type FeeStatus = 'Paid' | 'Pending' | 'Overdue';
export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';
export type TeacherStatus = 'Active' | 'On Leave' | 'Inactive';
export type ExamStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Graded';
export type NoticeCategory = 'Academic' | 'Administrative' | 'Events' | 'Examination' | 'Emergency';
export type NoticePriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Student {
  id: string;
  studentId: string; // e.g. "ET-2024-001"
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  dob: string;
  classId: string;
  className: string;
  section: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  admissionDate: string;
  status: StudentStatus;
  feeStatus: FeeStatus;
  attendanceRate: number; // percentage
  avatar?: string;
}

export interface Teacher {
  id: string;
  teacherId: string; // e.g. "TCH-102"
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  department: string;
  subjects: string[];
  classes: string[];
  qualification: string;
  joiningDate: string;
  status: TeacherStatus;
  salary: number;
  avatar?: string;
  room?: string;
}

export interface ClassItem {
  id: string;
  name: string; // e.g. "Grade 10"
  section: string; // e.g. "A"
  displayName: string; // "Grade 10-A"
  gradeLevel: number; // 10
  classTeacherId: string;
  classTeacherName: string;
  studentCount: number;
  capacity: number;
  roomNumber: string;
  schedule: string; // e.g. "08:00 AM - 02:30 PM"
}

export interface Subject {
  id: string;
  code: string; // e.g. "MATH-101"
  name: string;
  department: string;
  teacherId: string;
  teacherName: string;
  classes: string[];
  weeklyHours: number;
  credits: number;
  status: 'Active' | 'Inactive';
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  classId: string;
  className: string;
  markedBy: string;
  records: {
    studentId: string;
    studentName: string;
    rollNumber: string;
    status: AttendanceStatus;
    note?: string;
  }[];
}

export interface Exam {
  id: string;
  name: string; // e.g. "Mid-Term Examinations 2026"
  term: 'First Term' | 'Mid-Term' | 'Final Term' | 'Unit Test';
  examType: 'Written' | 'Practical' | 'Online' | 'Combined';
  startDate: string;
  endDate: string;
  classes: string[];
  status: ExamStatus;
  totalMarks: number;
}

export interface ExamScheduleItem {
  id: string;
  examId: string;
  examName: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  supervisor: string;
}

export interface GradeRecord {
  id: string;
  examId: string;
  examName: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  gradeLetter: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  status: 'Pass' | 'Fail';
  remarks?: string;
}

export interface FeeInvoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-089"
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  title: string; // e.g. "Term 2 Tuition & Lab Fee"
  amount: number;
  dueDate: string;
  paidAmount: number;
  balance: number;
  status: FeeStatus;
  paymentMethod?: 'Card' | 'Bank Transfer' | 'Cash' | 'Online Portal';
  paidDate?: string;
}

export interface Parent {
  id: string;
  name: string;
  relationship: 'Father' | 'Mother' | 'Guardian';
  email: string;
  phone: string;
  occupation: string;
  address: string;
  linkedStudentIds: string[];
  status: 'Active' | 'Inactive';
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number; // 1 to 7
  startTime: string;
  endTime: string;
  classId: string;
  className: string;
  subjectName: string;
  teacherName: string;
  room: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  priority: NoticePriority;
  targetAudience: 'All' | 'Students' | 'Teachers' | 'Parents';
  publishDate: string;
  author: string;
  isPublished: boolean;
}

export interface InstitutionSettings {
  institutionName: string;
  tagline: string;
  establishedYear: number;
  registrationNumber: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  principalName: string;
  academicYear: string;
  currencySymbol: string;
  allowStudentRegistration: boolean;
  enableSmsAlerts: boolean;
  enableEmailAlerts: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatarUrl: string;
  department: string;
  bio: string;
  lastLogin: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'student' | 'fee' | 'attendance' | 'exam' | 'notice' | 'system';
  time: string;
  read: boolean;
  link?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}
