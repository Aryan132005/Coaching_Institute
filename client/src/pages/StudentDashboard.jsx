import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { User, ClipboardList, MessageSquare, BookOpen, Clock, Calendar, CheckCircle } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [admissions, setAdmissions] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [admissionsRes, enquiriesRes] = await Promise.all([
          API.get('/admissions/my'),
          API.get('/enquiries/my'),
        ]);
        setAdmissions(admissionsRes.data);
        setEnquiries(enquiriesRes.data);
      } catch (err) {
        console.error('Error fetching student dashboard details', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) return <Loader />;

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
      approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
      rejected: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
      resolved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${styles[status] || styles.pending}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-slate-950 to-primary-900 z-0"></div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary-600/10 blur-[60px] rounded-full"></div>

        <div className="relative z-10 space-y-2 text-center md:text-left">
          <span className="text-primary-400 font-bold text-xs uppercase tracking-widest">Student Panel</span>
          <h1 className="text-3xl font-extrabold">Welcome back, {user?.name}!</h1>
          <p className="text-slate-400 text-sm">{user?.email} | {user?.phone || 'No phone provided'}</p>
        </div>

        <div className="relative z-10 flex space-x-6">
          <div className="text-center bg-slate-800/60 backdrop-blur-sm border border-slate-700/40 px-5 py-3 rounded-2xl">
            <span className="block text-2xl font-extrabold text-white">{admissions.length}</span>
            <span className="text-xs text-slate-400 font-medium">Applications</span>
          </div>
          <div className="text-center bg-slate-800/60 backdrop-blur-sm border border-slate-700/40 px-5 py-3 rounded-2xl">
            <span className="block text-2xl font-extrabold text-white">{enquiries.length}</span>
            <span className="text-xs text-slate-400 font-medium">Enquiries</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Admission Applications */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            <ClipboardList className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-extrabold">Course Registrations</h2>
          </div>

          {admissions.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
              <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-350">No Course Application</h3>
              <p className="text-xs text-slate-500">You haven't submitted any admissions application yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {admissions.map((ad) => (
                <div
                  key={ad._id}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      {ad.courseId?.category || 'General'}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white leading-snug">
                      {ad.courseId?.title || 'Applied Course'}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        Duration: <strong>{ad.courseId?.duration || '1 Year'}</strong>
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        Applied: <strong>{new Date(ad.appliedAt).toLocaleDateString()}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center justify-start sm:justify-end">
                    {getStatusBadge(ad.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Enquiries */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            <MessageSquare className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-extrabold">Counselor Enquiries</h2>
          </div>

          {enquiries.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
              <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-350">No Enquiries</h3>
              <p className="text-xs text-slate-500">You haven't submitted any queries through our contact page.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {enquiries.map((enq) => (
                <div
                  key={enq._id}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold">
                      Date: {new Date(enq.createdAt).toLocaleDateString()}
                    </span>
                    {getStatusBadge(enq.status)}
                  </div>
                  <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl">
                    <p className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-1">Your query:</p>
                    <p className="italic">"{enq.message}"</p>
                  </div>
                  {enq.status === 'resolved' && (
                    <div className="flex items-start space-x-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>An administrator has reviewed this enquiry. We have reached out to you via call/email.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default StudentDashboard;
