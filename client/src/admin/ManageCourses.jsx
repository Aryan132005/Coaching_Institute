import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { BookOpen, Plus, Edit, Trash2, Shield, ArrowLeft, Image } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageCourses = () => {
  const { showToast } = useAuth();
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    fees: '',
    category: '',
    faculty: '',
    seatsAvailable: '',
    image: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await API.get('/courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedCourse(null);
    setFormData({
      title: '',
      description: '',
      duration: '',
      fees: '',
      category: 'Engineering',
      faculty: '',
      seatsAvailable: 30,
      image: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      duration: course.duration,
      fees: course.fees,
      category: course.category,
      faculty: course.faculty,
      seatsAvailable: course.seatsAvailable,
      image: course.image || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.duration.trim()) errors.duration = 'Duration is required';
    if (!formData.fees || isNaN(formData.fees)) errors.fees = 'Fees must be a numeric value';
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (!formData.faculty.trim()) errors.faculty = 'Faculty names are required';
    if (!formData.seatsAvailable || isNaN(formData.seatsAvailable)) errors.seatsAvailable = 'Seats must be a number';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (selectedCourse) {
        // Edit course
        await API.put(`/courses/${selectedCourse._id}`, formData);
        showToast('Course updated successfully!', 'success');
      } else {
        // Create course
        await API.post('/courses', formData);
        showToast('New course created successfully!', 'success');
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (err) {
      console.error(err);
      showToast('Action failed. Verify validator schemas.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to remove this course program?')) return;
    try {
      await API.delete(`/courses/${courseId}`);
      showToast('Course removed successfully!', 'info');
      fetchCourses();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete course.', 'error');
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
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Manage Course Programs</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Full program details CRUD panel</p>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold flex items-center space-x-1.5 shadow-md shadow-primary-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Courses List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4">Title / Category</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Fees</th>
                <th className="px-6 py-4">Seats Left</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {courses.map((course) => (
                <tr key={course._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-white">{course.title}</div>
                    <span className="inline-block px-2 py-0.5 mt-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                      {course.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-350">{course.duration}</td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white font-semibold">₹{course.fees.toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-primary-500">{course.seatsAvailable}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(course)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit course"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                        title="Delete course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCourse ? 'Update Course Program' : 'Create Course Program'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Course Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-slate-950 dark:text-white"
              required
            />
            {formErrors.title && <span className="text-xs text-rose-500 font-semibold">{formErrors.title}</span>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-slate-950 dark:text-white"
              required
            ></textarea>
            {formErrors.description && <span className="text-xs text-rose-500 font-semibold">{formErrors.description}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-slate-700 dark:text-slate-350"
              >
                <option value="Engineering">Engineering</option>
                <option value="Medical">Medical</option>
                <option value="Technology">Technology</option>
                <option value="Civil Services">Civil Services</option>
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-slate-950 dark:text-white"
                placeholder="2 Years, 6 Months"
                required
              />
              {formErrors.duration && <span className="text-xs text-rose-500 font-semibold">{formErrors.duration}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Fees */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Fees (INR)</label>
              <input
                type="number"
                name="fees"
                value={formData.fees}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-slate-950 dark:text-white"
                required
              />
              {formErrors.fees && <span className="text-xs text-rose-500 font-semibold">{formErrors.fees}</span>}
            </div>

            {/* Seats */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Seats Available</label>
              <input
                type="number"
                name="seatsAvailable"
                value={formData.seatsAvailable}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-slate-950 dark:text-white"
                required
              />
              {formErrors.seatsAvailable && <span className="text-xs text-rose-500 font-semibold">{formErrors.seatsAvailable}</span>}
            </div>
          </div>

          {/* Faculty */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Faculty Mentors</label>
            <input
              type="text"
              name="faculty"
              value={formData.faculty}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-slate-950 dark:text-white"
              placeholder="Dr. Ramesh, Sarah Jenkins (comma separated)"
              required
            />
            {formErrors.faculty && <span className="text-xs text-rose-500 font-semibold">{formErrors.faculty}</span>}
          </div>

          {/* Image URL */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-slate-950 dark:text-white"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-md shadow-primary-500/20 text-sm transition-all"
          >
            {submitting ? 'Processing...' : selectedCourse ? 'Update Course' : 'Create Course'}
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default ManageCourses;
