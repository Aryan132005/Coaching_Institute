import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { Mail, Phone, Clock, CheckCircle2, MessageSquare, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ViewEnquiries = () => {
  const { showToast } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchEnquiries = async () => {
    try {
      const res = await API.get('/enquiries');
      setEnquiries(res.data);
    } catch (err) {
      console.error('Error fetching enquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleResolve = async (id) => {
    try {
      await API.put(`/enquiries/${id}/status`, { status: 'resolved' });
      showToast('Enquiry marked as resolved!', 'success');
      fetchEnquiries();
    } catch (err) {
      console.error(err);
      showToast('Failed to update enquiry status.', 'error');
    }
  };

  const filteredEnquiries = enquiries.filter((enq) => {
    if (filter === 'All') return true;
    return enq.status === filter;
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
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Counselor Enquiries</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Review submissions from website contact form</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1.5 border-b border-slate-100 dark:border-slate-800 pb-4">
        {['All', 'pending', 'resolved'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              filter === tab
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Enquiries Grid */}
      {filteredEnquiries.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-500">
          No enquiries found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEnquiries.map((enq) => (
            <div
              key={enq._id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">
                    Received: {new Date(enq.createdAt).toLocaleString()}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      enq.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    From: {enq.name}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 text-xs text-slate-500">
                    <span className="flex items-center">
                      <Mail className="w-3.5 h-3.5 mr-1" /> {enq.email}
                    </span>
                    <span className="flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-1" /> {enq.phone}
                    </span>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl text-xs text-slate-600 dark:text-slate-350 leading-relaxed border border-slate-100 dark:border-slate-800/40">
                  <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px] mb-1">
                    Student Query Detail
                  </span>
                  <p className="italic">"{enq.message}"</p>
                </div>
              </div>

              {/* Status Update */}
              {enq.status === 'pending' && (
                <button
                  onClick={() => handleResolve(enq._id)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 mt-4 shadow-md shadow-emerald-500/10"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Resolved</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ViewEnquiries;
