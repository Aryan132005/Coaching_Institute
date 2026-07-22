import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { Check, X, Shield, ArrowLeft, Search, Filter, Mail, Phone, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageAdmissions = () => {
  const { showToast } = useAuth();
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchAdmissions = async () => {
    try {
      const res = await API.get('/admissions');
      setAdmissions(res.data);
    } catch (err) {
      console.error('Error fetching admissions submissions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/admissions/${id}/status`, { status });
      showToast(`Admission application marked as ${status}!`, 'success');
      fetchAdmissions();
    } catch (err) {
      console.error(err);
      showToast('Failed to update status.', 'error');
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
      approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
      rejected: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
    };
    return styles[status] || styles.pending;
  };

  const filteredAdmissions = admissions.filter((ad) => {
    const matchesStatus = statusFilter === 'All' || ad.status === statusFilter;
    const matchesSearch =
      ad.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.courseId?.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-6">
        <Link to="/admin/dashboard" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-350">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Review Admissions</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Verify student certificates and approve registrations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-xs"
          />
        </div>

        <div className="flex space-x-1.5 overflow-x-auto w-full md:w-auto">
          {['All', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                statusFilter === status
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/10'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid submissions */}
      {filteredAdmissions.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-500">
          No admission applications found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAdmissions.map((ad) => (
            <div
              key={ad._id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Course: {ad.courseId?.category || 'General'}
                  </span>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight mt-0.5">
                    {ad.courseId?.title || 'Unknown Program'}
                  </h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getStatusStyle(ad.status)}`}>
                  {ad.status}
                </span>
              </div>

              {/* Personal data */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl text-xs space-y-2 text-slate-600 dark:text-slate-350">
                <div className="font-semibold text-slate-900 dark:text-white">Student: {ad.studentName}</div>
                <div className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ad.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ad.phone}</span>
                </div>
              </div>

              {/* Docs details */}
              <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1">
                <div className="font-bold flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1" /> Document/ID verification:
                </div>
                <p className="italic text-slate-400">"{ad.documents || 'None provided'}"</p>
              </div>

              {/* Status Update CTA */}
              {ad.status === 'pending' && (
                <div className="flex space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleUpdateStatus(ad._id, 'approved')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1"
                  >
                    <Check className="w-4 h-4" /> <span>Approve Admission</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(ad._id, 'rejected')}
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1"
                  >
                    <X className="w-4 h-4" /> <span>Reject Application</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ManageAdmissions;
