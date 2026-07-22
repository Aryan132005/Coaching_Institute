import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { 
  User, 
  ClipboardList, 
  MessageSquare, 
  BookOpen, 
  Clock, 
  Calendar, 
  CheckCircle, 
  Mail, 
  Phone, 
  Shield, 
  CalendarDays 
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [admissions, setAdmissions] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // tabs: 'profile', 'registrations', 'enquiries'

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

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
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
          <div 
            onClick={() => setActiveTab('registrations')}
            className="text-center bg-slate-800/60 hover:bg-slate-800/90 cursor-pointer backdrop-blur-sm border border-slate-700/40 px-5 py-3 rounded-2xl transition-all"
          >
            <span className="block text-2xl font-extrabold text-white">{admissions.length}</span>
            <span className="text-xs text-slate-400 font-medium">Applications</span>
          </div>
          <div 
            onClick={() => setActiveTab('enquiries')}
            className="text-center bg-slate-800/60 hover:bg-slate-800/90 cursor-pointer backdrop-blur-sm border border-slate-700/40 px-5 py-3 rounded-2xl transition-all"
          >
            <span className="block text-2xl font-extrabold text-white">{enquiries.length}</span>
            <span className="text-xs text-slate-400 font-medium">Enquiries</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 px-6 py-3.5 border-b-2 font-bold text-sm transition-all rounded-t-xl ${
            activeTab === 'profile'
              ? 'border-primary-500 text-primary-600 bg-primary-50/20 dark:bg-primary-950/10'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <User className="w-4 h-4" />
          <span>My Profile</span>
        </button>
        <button
          onClick={() => setActiveTab('registrations')}
          className={`flex items-center space-x-2 px-6 py-3.5 border-b-2 font-bold text-sm transition-all rounded-t-xl ${
            activeTab === 'registrations'
              ? 'border-primary-500 text-primary-600 bg-primary-50/20 dark:bg-primary-950/10'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Course Registrations</span>
          {admissions.length > 0 && (
            <span className="bg-primary-500 text-white text-[10px] px-2 py-0.5 rounded-full">
              {admissions.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`flex items-center space-x-2 px-6 py-3.5 border-b-2 font-bold text-sm transition-all rounded-t-xl ${
            activeTab === 'enquiries'
              ? 'border-primary-500 text-primary-600 bg-primary-50/20 dark:bg-primary-950/10'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Counselor Enquiries</span>
          {enquiries.length > 0 && (
            <span className="bg-primary-500 text-white text-[10px] px-2 py-0.5 rounded-full">
              {enquiries.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Contents */}
      <div className="mt-8">
        
        {/* Tab 1: Profile View */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-8 border-b border-slate-100 dark:border-slate-800 pb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-primary-500/20 shrink-0">
                {getInitials(user?.name)}
              </div>
              <div className="text-center md:text-left space-y-1">
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{user?.name}</h2>
                  <span className="px-2.5 py-0.5 text-[10px] font-black tracking-widest uppercase bg-primary-100 text-primary-800 dark:bg-primary-950/40 dark:text-primary-300 rounded-full">
                    {user?.role || 'student'}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Account ID: #{user?._id || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Details List */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100/50 dark:border-slate-800/30">
                    <Mail className="w-5 h-5 text-primary-500 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user?.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100/50 dark:border-slate-800/30">
                    <Phone className="w-5 h-5 text-primary-500 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Contact Phone</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user?.phone || 'Not Provided'}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100/50 dark:border-slate-800/30">
                    <Shield className="w-5 h-5 text-primary-500 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">User Account Role</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">{user?.role || 'student'}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100/50 dark:border-slate-800/30">
                    <CalendarDays className="w-5 h-5 text-primary-500 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Joined Academy On</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {user?.createdAt 
                          ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                          : new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Summary & Quick Actions */}
              <div className="space-y-6 bg-slate-50/50 dark:bg-slate-950/20 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Academic Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
                    <span className="text-xs font-semibold text-slate-500">Admissions Applied</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                      {admissions.length} Programs
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
                    <span className="text-xs font-semibold text-slate-500">Pending Approvals</span>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100/55 dark:bg-amber-900/30 px-2.5 py-1 rounded-lg">
                      {admissions.filter(ad => ad.status === 'pending').length} Courses
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
                    <span className="text-xs font-semibold text-slate-500">Active Counselor Enquiries</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                      {enquiries.filter(e => e.status === 'pending').length} Pending
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
                  <button 
                    onClick={() => setActiveTab('registrations')}
                    className="w-full text-center block bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
                  >
                    View Registered Courses
                  </button>
                  <button 
                    onClick={() => setActiveTab('enquiries')}
                    className="w-full text-center block bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all"
                  >
                    Check Counselor Replies
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Course Registrations View */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-slate-900 dark:text-white pb-1">
              <ClipboardList className="w-5 h-5 text-primary-500" />
              <h2 className="text-xl font-bold">Course Registrations</h2>
            </div>

            {admissions.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
                <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Course Application</h3>
                <p className="text-sm text-slate-400">You haven't submitted any admissions application yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {admissions.map((ad) => (
                  <div
                    key={ad._id}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center justify-between gap-4 transition-all hover:shadow-md"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider">
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
                    <div className="shrink-0 flex items-center justify-end">
                      {getStatusBadge(ad.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Counselor Enquiries View */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-slate-900 dark:text-white pb-1">
              <MessageSquare className="w-5 h-5 text-primary-500" />
              <h2 className="text-xl font-bold">Counselor Enquiries</h2>
            </div>

            {enquiries.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
                <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Enquiries</h3>
                <p className="text-sm text-slate-400">You haven't submitted any queries through our contact page.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enquiries.map((enq) => (
                  <div
                    key={enq._id}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4 transition-all hover:shadow-md flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-bold">
                          Date: {new Date(enq.createdAt).toLocaleDateString()}
                        </span>
                        {getStatusBadge(enq.status)}
                      </div>
                      <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100/50 dark:border-slate-800/30">
                        <p className="font-semibold text-xs text-slate-450 uppercase tracking-wider mb-1">Your query:</p>
                        <p className="italic">"{enq.message}"</p>
                      </div>
                    </div>
                    {enq.status === 'resolved' && (
                      <div className="flex items-start space-x-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/30 mt-2">
                        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>An administrator has reviewed this enquiry. We have reached out to you via call/email.</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentDashboard;
