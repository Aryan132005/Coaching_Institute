import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { CheckCircle2, ShieldAlert, FileText, ArrowRight } from 'lucide-react';

const Admission = () => {
  const { user, showToast } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCourseId = searchParams.get('courseId') || '';

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    studentName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    courseId: preselectedCourseId,
    documents: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Error fetching courses list', err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // Handle preselected course if course list loads later
  useEffect(() => {
    if (preselectedCourseId) {
      setFormData((prev) => ({ ...prev, courseId: preselectedCourseId }));
    }
  }, [preselectedCourseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentName.trim()) newErrors.studentName = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,14}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.courseId) newErrors.courseId = 'Please select a program/course';
    if (!formData.documents.trim()) newErrors.documents = 'Document detail/link is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await API.post('/admissions', formData);
      showToast('Admission application submitted successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Submission failed. Please check inputs.';
      showToast(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // If student is not logged in, show Auth Gate
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-6 shadow-xl">
        <ShieldAlert className="w-16 h-16 text-primary-500 mx-auto" />
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Authentication Required</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          To submit an online admission application and track your status, you must create a student account and sign in.
        </p>
        <div className="flex flex-col space-y-3 pt-2">
          <Link
            to={`/login?redirect=admission&courseId=${preselectedCourseId}`}
            className="py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors"
          >
            Log In to Account
          </Link>
          <Link
            to="/register"
            className="py-3 bg-slate-100 hover:bg-slate-250 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm transition-colors"
          >
            Create New Account
          </Link>
        </div>
      </div>
    );
  }

  if (loadingCourses) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl space-y-8">
        
        {/* Title */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Online Admission Application</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Fill out the details below. Our admissions board will verify your application within 2-3 working days.
          </p>
        </div>

        {/* Steps Info */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex flex-col items-center space-y-1">
            <span className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">1</span>
            <span>Verify Profile</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">2</span>
            <span>Select Program</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">3</span>
            <span>Upload Info</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Student Full Name
              </label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm"
                placeholder="John Doe"
              />
              {errors.studentName && <span className="text-xs font-semibold text-rose-500">{errors.studentName}</span>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm"
                placeholder="student@example.com"
              />
              {errors.email && <span className="text-xs font-semibold text-rose-500">{errors.email}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm"
                placeholder="9876543210"
              />
              {errors.phone && <span className="text-xs font-semibold text-rose-500">{errors.phone}</span>}
            </div>

            {/* Course Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Choose Program
              </label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-slate-700 dark:text-slate-350"
              >
                <option value="">-- Choose Course --</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title} (₹{course.fees.toLocaleString()})
                  </option>
                ))}
              </select>
              {errors.courseId && <span className="text-xs font-semibold text-rose-500">{errors.courseId}</span>}
            </div>
          </div>

          {/* Document Upload placeholder */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center">
              <FileText className="w-4 h-4 mr-1 text-slate-400" />
              Document Submission (Certificates / ID Card Info)
            </label>
            <textarea
              name="documents"
              value={formData.documents}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm"
              placeholder="Paste Google Drive/Dropbox links to High School Grade sheet and identity proof, or list previous academic records."
            ></textarea>
            {errors.documents && <span className="text-xs font-semibold text-rose-500">{errors.documents}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-md shadow-primary-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{submitting ? 'Submitting Application...' : 'Submit Application'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

        </form>

      </div>
    </div>
  );
};

export default Admission;
