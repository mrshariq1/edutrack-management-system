import React, { useState, useMemo } from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { TimetableSlot } from '../types';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  Clock,
  Plus,
  Layers,
  Edit2,
  Trash2,
  GraduationCap,
  DoorOpen,
} from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
type DayType = typeof DAYS[number];

export const Timetable: React.FC = () => {
  const { timetable, classes, subjects, teachers, addTimetableSlot, updateTimetableSlot, deleteTimetableSlot } = useEduTrack();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedDayMobile, setSelectedDayMobile] = useState<DayType>('Monday');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);
  const [deletingSlot, setDeletingSlot] = useState<TimetableSlot | null>(null);

  const initialForm = {
    day: 'Monday' as DayType,
    period: 1,
    startTime: '08:00 AM',
    endTime: '08:50 AM',
    classId: classes[0]?.id || '',
    subjectName: subjects[0]?.name || 'Advanced Calculus',
    teacherName: teachers[0]?.name || 'Dr. Eleanor Campbell',
    room: 'Room 301',
  };
  const [formData, setFormData] = useState(initialForm);

  // Filter slots for the selected class
  const classSlots = useMemo(() => {
    return timetable.filter(t => t.classId === selectedClassId);
  }, [timetable, selectedClassId]);

  // Group by day
  const slotsByDay = useMemo(() => {
    const map: Record<DayType, TimetableSlot[]> = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
    };
    classSlots.forEach(s => {
      if (map[s.day as DayType]) {
        map[s.day as DayType].push(s);
      }
    });
    // Sort each day by period
    Object.keys(map).forEach(d => {
      map[d as DayType].sort((a, b) => a.period - b.period);
    });
    return map;
  }, [classSlots]);

  const handleOpenAdd = (day?: DayType) => {
    setFormData({
      ...initialForm,
      day: day || 'Monday',
      classId: selectedClassId,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (slot: TimetableSlot) => {
    setEditingSlot(slot);
    setFormData({
      day: slot.day,
      period: slot.period,
      startTime: slot.startTime,
      endTime: slot.endTime,
      classId: slot.classId,
      subjectName: slot.subjectName,
      teacherName: slot.teacherName,
      room: slot.room,
    });
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const cls = classes.find(c => c.id === formData.classId);
    addTimetableSlot({
      ...formData,
      className: cls ? cls.displayName : 'Grade 10-A',
    });
    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot) return;
    const cls = classes.find(c => c.id === formData.classId);
    updateTimetableSlot(editingSlot.id, {
      ...formData,
      className: cls ? cls.displayName : editingSlot.className,
    });
    setEditingSlot(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Institutional Master Timetable
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Weekly instructional schedule, period hours, subject allocation, and classroom venues.
          </p>
        </div>

        <button
          onClick={() => handleOpenAdd()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Schedule Slot</span>
        </button>
      </div>

      {/* Class Selector Bar */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Layers className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Selected Class:
          </span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-hidden"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.displayName} ({c.roomNumber})</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Weekly schedule: Monday to Saturday (8:00 AM — 2:30 PM)
        </div>
      </div>

      {/* Mobile Day Selector Tabs */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto pb-1">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDayMobile(day)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedDayMobile === day
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {day} ({slotsByDay[day].length})
          </button>
        ))}
      </div>

      {/* Desktop Weekly Grid (6 Days) */}
      <div className="hidden lg:grid grid-cols-6 gap-4">
        {DAYS.map((day) => (
          <div
            key={day}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs flex flex-col"
          >
            <div className="p-3 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {day}
              </span>
              <button
                onClick={() => handleOpenAdd(day)}
                className="p-1 rounded text-slate-400 hover:text-blue-600"
                title={`Add slot to ${day}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 flex-1 space-y-2.5 min-h-[400px]">
              {slotsByDay[day].length > 0 ? (
                slotsByDay[day].map((slot) => (
                  <div
                    key={slot.id}
                    className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-1 group relative hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {slot.subjectName}
                      </span>
                      <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 shrink-0">
                        P{slot.period}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{slot.startTime}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                      <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{slot.teacherName}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                      <span>{slot.room}</span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(slot)}
                          className="hover:text-amber-600"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setDeletingSlot(slot)}
                          className="hover:text-rose-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 text-xs py-8">
                  <span>No periods scheduled</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View: Selected Day Card */}
      <div className="lg:hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {selectedDayMobile} Schedule
          </h3>
          <button
            onClick={() => handleOpenAdd(selectedDayMobile)}
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold"
          >
            + Add Period
          </button>
        </div>

        {slotsByDay[selectedDayMobile].length > 0 ? (
          slotsByDay[selectedDayMobile].map((slot) => (
            <div
              key={slot.id}
              className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">
                  Period {slot.period}: {slot.subjectName}
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  {slot.startTime} - {slot.endTime}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Teacher: {slot.teacherName}</span>
                <span>{slot.room}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-xs text-slate-400 py-6">
            No schedule slots recorded for {selectedDayMobile}.
          </p>
        )}
      </div>

      {/* Add / Edit Timetable Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingSlot}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingSlot(null);
        }}
        title={editingSlot ? 'Edit Timetable Period' : 'Add Timetable Slot'}
        subtitle="Schedule instructional timing, room, and teacher"
      >
        <form onSubmit={editingSlot ? handleSubmitEdit : handleSubmitAdd} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Day of Week
              </label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value as DayType })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                {DAYS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Period Sequence
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Time
              </label>
              <input
                type="text"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                placeholder="08:00 AM"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                End Time
              </label>
              <input
                type="text"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                placeholder="08:50 AM"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subject Name
            </label>
            <select
              value={formData.subjectName}
              onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.name}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Instructor
              </label>
              <select
                value={formData.teacherName}
                onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Room / Lab
              </label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="Room 301"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingSlot(null);
              }}
              className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              {editingSlot ? 'Update Slot' : 'Save Slot'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingSlot}
        onClose={() => setDeletingSlot(null)}
        onConfirm={() => {
          if (deletingSlot) {
            deleteTimetableSlot(deletingSlot.id);
            setDeletingSlot(null);
          }
        }}
        title="Remove Timetable Period"
        message={`Delete Period ${deletingSlot?.period} (${deletingSlot?.subjectName}) on ${deletingSlot?.day}?`}
      />
    </div>
  );
};
