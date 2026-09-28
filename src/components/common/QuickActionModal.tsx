import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from './Modal';
import {
  UserPlus,
  CreditCard,
  CalendarCheck,
  FileSpreadsheet,
  Megaphone,
  GraduationCap,
  Layers,
  BookOpen,
} from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddStudent?: () => void;
  onOpenRecordPayment?: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  onOpenAddStudent,
  onOpenRecordPayment,
}) => {
  const navigate = useNavigate();

  const handleAction = (path: string, callback?: () => void) => {
    onClose();
    if (callback) {
      callback();
    } else {
      navigate(path);
    }
  };

  const actions = [
    {
      title: 'Enroll New Student',
      desc: 'Register student profile, class allotment, parent contacts',
      icon: <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      action: () => handleAction('/students', onOpenAddStudent),
    },
    {
      title: 'Record Fee Payment',
      desc: 'Post settlement for tuition, laboratory kits, or activities',
      icon: <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      action: () => handleAction('/fees', onOpenRecordPayment),
    },
    {
      title: 'Take Daily Attendance',
      desc: 'Batch mark presence/absence for today with one click',
      icon: <CalendarCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      action: () => handleAction('/attendance'),
    },
    {
      title: 'Publish Notice Circular',
      desc: 'Broadcast administrative, event, or exam circulars',
      icon: <Megaphone className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      action: () => handleAction('/notices'),
    },
    {
      title: 'Schedule Examination',
      desc: 'Create new exam period, subject papers and supervisors',
      icon: <FileSpreadsheet className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      action: () => handleAction('/exams'),
    },
    {
      title: 'Appoint Faculty Member',
      desc: 'Add instructor, qualifications, departments and classes',
      icon: <GraduationCap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      action: () => handleAction('/teachers'),
    },
    {
      title: 'Manage Classes & Rooms',
      desc: 'Configure grade sections, room allocations and capacity',
      icon: <Layers className="w-5 h-5 text-slate-600 dark:text-slate-400" />,
      action: () => handleAction('/classes'),
    },
    {
      title: 'Review Grade Reports',
      desc: 'Audit student assessments, report cards and grade distribution',
      icon: <BookOpen className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      action: () => handleAction('/grades'),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Institutional Quick Actions"
      subtitle="Fast workflow access across registries and operations"
      maxWidth="2xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
        {actions.map((act, idx) => (
          <button
            key={idx}
            type="button"
            onClick={act.action}
            className="flex items-start gap-3.5 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 text-left transition-all group"
          >
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:scale-105 transition-transform shrink-0">
              {act.icon}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {act.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                {act.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
};
