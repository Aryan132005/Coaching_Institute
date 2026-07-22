import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Loader from '../components/Loader';
import { Calendar, Megaphone, User } from 'lucide-react';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchNotices();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Announcements & Notices</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Stay up to date with the latest scholarship tests, holiday schedules, and batch commencement calendars.
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : notices.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <Megaphone className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No New Notices</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Check back later for recent board updates.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {notices.map((notice) => (
            <div
              key={notice._id}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              {/* Highlight bar */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-600"></div>

              <div className="space-y-2 pl-2">
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center text-primary-500 font-semibold bg-primary-50 dark:bg-primary-950/40 px-2.5 py-1 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {formatDate(notice.date)}
                  </span>
                  <span className="flex items-center">
                    <User className="w-3.5 h-3.5 mr-1" />
                    Posted by: <strong>{notice.postedBy?.name || 'Administrator'}</strong>
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {notice.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap pt-2">
                  {notice.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Notices;
