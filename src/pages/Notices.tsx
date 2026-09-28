import React, { useState, useMemo } from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { Notice, NoticeCategory, NoticePriority } from '../types';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Badge } from '../components/common/Badge';
import {
  Megaphone,
  Plus,
  Search,
  Calendar,
  User,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const Notices: React.FC = () => {
  const { notices, adminUser, addNotice, updateNotice, deleteNotice } = useEduTrack();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null);
  const [deletingNotice, setDeletingNotice] = useState<Notice | null>(null);

  const initialForm = {
    title: '',
    content: '',
    category: 'Academic' as NoticeCategory,
    priority: 'Medium' as NoticePriority,
    targetAudience: 'All' as Notice['targetAudience'],
    publishDate: new Date().toISOString().split('T')[0],
    author: adminUser.name,
    isPublished: true,
  };
  const [formData, setFormData] = useState(initialForm);

  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.author.toLowerCase().includes(q);

      const matchesCat = selectedCategory === 'all' || n.category === selectedCategory;
      const matchesPri = selectedPriority === 'all' || n.priority === selectedPriority;

      return matchesSearch && matchesCat && matchesPri;
    });
  }, [notices, search, selectedCategory, selectedPriority]);

  const handleOpenAdd = () => {
    setFormData(initialForm);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (n: Notice) => {
    setEditingNotice(n);
    setFormData({
      title: n.title,
      content: n.content,
      category: n.category,
      priority: n.priority,
      targetAudience: n.targetAudience,
      publishDate: n.publishDate,
      author: n.author,
      isPublished: n.isPublished,
    });
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    addNotice(formData);
    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;
    updateNotice(editingNotice.id, formData);
    setEditingNotice(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Notices & Administrative Circulars
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Broadcast official circulars, examination alerts, academic schedules, and institutional announcements.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Circular</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search circulars by keyword, title, or author..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Administrative">Administrative</option>
            <option value="Events">Events</option>
            <option value="Examination">Examination</option>
            <option value="Emergency">Emergency</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-mono">
          {filteredNotices.length} published circulars
        </span>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            className={`rounded-xl border bg-white dark:bg-slate-900 p-5 shadow-xs transition-all flex flex-col justify-between ${
              notice.priority === 'Urgent'
                ? 'border-rose-300 dark:border-rose-900/60 ring-1 ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
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
                    dot
                  >
                    {notice.priority}
                  </Badge>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(notice)}
                    className="p-1.5 rounded text-slate-400 hover:text-amber-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingNotice(notice)}
                    className="p-1.5 rounded text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3
                onClick={() => setViewingNotice(notice)}
                className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer transition-colors"
              >
                {notice.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                {notice.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {notice.publishDate}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {notice.author}
                </span>
              </div>

              <button
                onClick={() => setViewingNotice(notice)}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Read Full</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Notice Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingNotice}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingNotice(null);
        }}
        title={editingNotice ? 'Edit Circular Notice' : 'Broadcast New Notice'}
        subtitle="Publish to student and faculty circular logs"
        maxWidth="xl"
      >
        <form onSubmit={editingNotice ? handleSubmitEdit : handleSubmitAdd} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Circular Headline *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Mid-Term Examination Protocols & Schedule Published"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Notice Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Academic">Academic</option>
                <option value="Administrative">Administrative</option>
                <option value="Events">Events</option>
                <option value="Examination">Examination</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority Ranking
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Audience
              </label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="All">All Campus Stakeholders</option>
                <option value="Students">Enrolled Students</option>
                <option value="Teachers">Faculty & Staff</option>
                <option value="Parents">Parents & Guardians</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Publish Date
              </label>
              <input
                type="date"
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notice Full Body Text *
            </label>
            <textarea
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Draft official circular announcement details..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingNotice(null);
              }}
              className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              {editingNotice ? 'Update Circular' : 'Publish Notice'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Notice Detail Modal */}
      {viewingNotice && (
        <Modal
          isOpen={!!viewingNotice}
          onClose={() => setViewingNotice(null)}
          title={viewingNotice.title}
          subtitle={`Published on ${viewingNotice.publishDate} by ${viewingNotice.author}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {viewingNotice.category}
              </span>
              <Badge variant={viewingNotice.priority === 'Urgent' ? 'danger' : 'warning'}>
                Priority: {viewingNotice.priority}
              </Badge>
              <span className="text-slate-400">Target: {viewingNotice.targetAudience}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed text-sm whitespace-pre-line">
              {viewingNotice.content}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewingNotice(null)}
                className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingNotice}
        onClose={() => setDeletingNotice(null)}
        onConfirm={() => {
          if (deletingNotice) {
            deleteNotice(deletingNotice.id);
            setDeletingNotice(null);
          }
        }}
        title="Delete Circular"
        message={`Delete circular "${deletingNotice?.title}"? This notice will be archived from stakeholder feeds.`}
      />
    </div>
  );
};
