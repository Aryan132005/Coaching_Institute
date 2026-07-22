import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { Megaphone, Plus, Edit, Trash2, ArrowLeft, ToggleLeft, ToggleRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageAnnouncements = () => {
  const { showToast } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & form details
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchNotices = async () => {
    try {
      const res = await API.get('/announcements');
      setNotices(res.data);
    } catch (err) {
      console.error('Error fetching notices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedNotice(null);
    setFormData({ title: '', description: '', isActive: true });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (notice) => {
    setSelectedNotice(notice);
    setFormData({
      title: notice.title,
      description: notice.description,
      isActive: notice.isActive,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description text is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (selectedNotice) {
        await API.put(`/announcements/${selectedNotice._id}`, formData);
        showToast('Notice details updated successfully!', 'success');
      } else {
        await API.post('/announcements', formData);
        showToast('New notice posted successfully!', 'success');
      }
      setIsModalOpen(false);
      fetchNotices();
    } catch (err) {
      console.error(err);
      showToast('Action failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await API.delete(`/announcements/${id}`);
      showToast('Announcement notice deleted!', 'info');
      fetchNotices();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete notice.', 'error');
    }
  };

  const handleToggleActive = async (notice) => {
    try {
      await API.put(`/announcements/${notice._id}`, {
        ...notice,
        isActive: !notice.isActive,
      });
      showToast('Notice status updated!', 'success');
      fetchNotices();
    } catch (err) {
      console.error(err);
      showToast('Failed to toggle status.', 'error');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6 gap-4">
        <div className="flex items-center space-x-3">
          <Link to="/admin/dashboard" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-350">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Announcements Manager</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Create and publish active campus notices</p>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold flex items-center space-x-1.5 shadow-md shadow-primary-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>Post Notice</span>
        </button>
      </div>

      {/* Notices list */}
      {notices.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-500">
          No notices found. Click "Post Notice" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notices.map((notice) => (
            <div
              key={notice._id}
              className={`bg-white dark:bg-slate-900 border p-6 rounded-3xl shadow-sm space-y-4 relative ${
                notice.isActive ? 'border-slate-100 dark:border-slate-800' : 'border-slate-100 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400">
                    Posted: {new Date(notice.date).toLocaleDateString()}
                  </span>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug">
                    {notice.title}
                  </h3>
                </div>

                <button
                  onClick={() => handleToggleActive(notice)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title={notice.isActive ? 'Mark Inactive' : 'Mark Active'}
                >
                  {notice.isActive ? (
                    <ToggleRight className="w-6 h-6 text-primary-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-300 dark:text-slate-700" />
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic whitespace-pre-wrap">
                "{notice.description}"
              </p>

              {/* Action triggers */}
              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleOpenEditModal(notice)}
                  className="p-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-primary-600 flex items-center space-x-1"
                >
                  <Edit className="w-3.5 h-3.5" /> <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(notice._id)}
                  className="p-1.5 text-xs font-bold text-rose-500 hover:underline flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notice Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedNotice ? 'Update Announcement' : 'Post Announcement'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Notice Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-slate-950 dark:text-white"
              required
            />
            {formErrors.title && <span className="text-xs text-rose-500 font-semibold">{formErrors.title}</span>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Message Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows="4"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-slate-950 dark:text-white"
              required
            ></textarea>
            {formErrors.description && <span className="text-xs text-rose-500 font-semibold">{formErrors.description}</span>}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
              className="rounded border-slate-200 dark:border-slate-800 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="isActive" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Publish announcement immediately (Active)
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-md shadow-primary-500/20 text-sm transition-all"
          >
            {submitting ? 'Posting...' : selectedNotice ? 'Update Notice' : 'Publish Notice'}
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default ManageAnnouncements;
