import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Loader from '../components/Loader';
import { Calendar, User, IndianRupee, Layers, CheckCircle2, ShieldAlert } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await API.get(`/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error('Error fetching course details', err);
        setError('Course not found or database connection failure.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <Loader />;

  if (error || !course) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Error Loading Course</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{error || 'Course details are not available'}</p>
        <Link to="/courses" className="inline-block px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-sm">
          Back to Courses
        </Link>
      </div>
    );
  }

  // Split faculty list if multiple names
  const faculties = course.faculty.split(',').map((f) => f.trim());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Course Details (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image */}
          <div className="h-96 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 dark:border-slate-800 shadow-sm">
            <img
              src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80'}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
              {course.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {course.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed whitespace-pre-line">
              {course.description}
            </p>
          </div>

          {/* Curriculum highlight box */}
          <div className="p-6 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">What this program covers:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Step-by-step lecture series with exercises</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>All India Test Series (AITS) integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Dedicated offline/online doubt counters</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>1-on-1 counseling with expert supervisors</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel (Right 1 col) */}
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-lg space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-150 dark:border-slate-800 pb-3">
              Program Details
            </h3>

            {/* Params list */}
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-slate-400">
                  <Calendar className="w-4 h-4 mr-2" /> Duration
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{course.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-slate-400">
                  <Layers className="w-4 h-4 mr-2" /> Seats Available
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{course.seatsAvailable} Left</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                <span className="flex items-center text-slate-400">
                  <IndianRupee className="w-4 h-4 mr-2 text-primary-500" /> Fees
                </span>
                <span className="font-extrabold text-lg text-primary-600 dark:text-primary-400">
                  ₹{course.fees.toLocaleString()}
                </span>
              </div>
            </div>

            {/* CTA */}
            <Link
              to={`/admission?courseId=${course._id}`}
              className="block w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-center text-sm transition-all shadow-md shadow-primary-500/10"
            >
              Apply Online Now
            </Link>
          </div>

          {/* Mentors Card */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-md space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
              Course Mentors
            </h4>
            <div className="space-y-3">
              {faculties.map((fac, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 text-sm">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{fac}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
