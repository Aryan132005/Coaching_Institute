import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { Shield, BookOpen, UserCheck, Clock, MessageSquare, AlertCircle, CheckCircle, ChevronRight, FileText, Megaphone } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [courses, setCourses] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auth Guard
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [coursesRes, admissionsRes, enquiriesRes, announcementsRes] = await Promise.all([
          API.get('/courses'),
          API.get('/admissions'),
          API.get('/enquiries'),
          API.get('/announcements'),
        ]);
        setCourses(coursesRes.data);
        setAdmissions(admissionsRes.data);
        setEnquiries(enquiriesRes.data);
        setAnnouncements(announcementsRes.data);
      } catch (err) {
        console.error('Error fetching admin dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <Loader />;

  // Compute metrics
  const totalCourses = courses.length;
  const totalAdmissions = admissions.length;
  const pendingAdmissions = admissions.filter((a) => a.status === 'pending').length;
  const pendingEnquiries = enquiries.filter((e) => e.status === 'pending').length;

  const stats = [
    { label: 'Total Programs', count: totalCourses, icon: <BookOpen className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50 dark:bg-blue-950/20' },
    { label: 'Total Registrations', count: totalAdmissions, icon: <UserCheck className="w-5 h-5 text-emerald-500" />, bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
    { label: 'Pending Approvals', count: pendingAdmissions, icon: <Clock className="w-5 h-5 text-amber-500" />, bg: 'bg-amber-50 dark:bg-amber-950/20' },
    { label: 'Open Enquiries', count: pendingEnquiries, icon: <MessageSquare className="w-5 h-5 text-purple-500" />, bg: 'bg-purple-50 dark:bg-purple-950/20' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6 gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 text-primary-600 dark:text-primary-400">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Management Suite</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Dashboard</h1>
        </div>

        {/* Action quick links */}
        <div className="flex flex-wrap justify-center gap-2.5">
          <Link to="/admin/courses" className="px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl shadow-sm">
            Manage Courses
          </Link>
          <Link to="/admin/admissions" className="px-4 py-2.5 bg-primary-600 text-white text-xs font-bold rounded-xl shadow-sm">
            Admissions List
          </Link>
          <Link to="/admin/announcements" className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl">
            Edit Notices
          </Link>
          <Link to="/admin/enquiries" className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl">
            Student Enquiries
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm flex items-center space-x-4"
          >
            <div className={`p-3 rounded-xl shrink-0 ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-slate-900 dark:text-white">{stat.count}</span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick summaries lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Latest Pending Admissions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center text-base">
              <FileText className="w-5 h-5 mr-1.5 text-primary-500" /> Recent Admission Submissions
            </h3>
            <Link to="/admin/admissions" className="text-xs text-primary-500 font-bold hover:underline flex items-center">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {admissions.filter(a => a.status === 'pending').length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              No pending registrations currently.
            </div>
          ) : (
            <div className="space-y-3">
              {admissions.filter(a => a.status === 'pending').slice(0, 3).map((ad) => (
                <div key={ad._id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-between gap-4 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{ad.studentName}</h4>
                    <p className="text-slate-400 text-[10px] mt-0.5">Applied: {ad.courseId?.title || 'Unknown Course'}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-bold uppercase tracking-wider text-[9px]">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest Enquiries */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center text-base">
              <Megaphone className="w-5 h-5 mr-1.5 text-primary-500" /> Recent Contact Enquiries
            </h3>
            <Link to="/admin/enquiries" className="text-xs text-primary-500 font-bold hover:underline flex items-center">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {enquiries.filter(e => e.status === 'pending').length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              No unresolved enquiries.
            </div>
          ) : (
            <div className="space-y-3">
              {enquiries.filter(e => e.status === 'pending').slice(0, 3).map((enq) => (
                <div key={enq._id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{enq.name} ({enq.email})</span>
                    <span className="text-slate-400">{new Date(enq.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 italic line-clamp-1">"{enq.message}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
