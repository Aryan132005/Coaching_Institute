import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import Loader from '../components/Loader';
import { Search, Filter, BookOpen, Clock, CreditCard, ArrowRight } from 'lucide-react';

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');

  // Categories list
  const categories = ['All', 'Engineering', 'Medical', 'Technology', 'Civil Services'];

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await API.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Error fetching courses list', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Update category from URL if changed
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  // Filter courses locally
  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Our Courses & Programs</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Find the perfect roadmap. Filter by department or search directly using keywords.
        </p>
      </div>

      {/* Search and Filter Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm"
          />
        </div>

        {/* Categories Horizontal */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto scrollbar-none py-1">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <Loader />
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Courses Found</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Try modifying your search or filter keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              <div className="h-48 relative overflow-hidden bg-slate-100">
                <img
                  src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80'}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-900/80 text-accent-400 backdrop-blur-sm">
                  {course.category}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed flex-grow">
                  {course.description}
                </p>
                
                {/* Details Footer */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-2">
                    <Clock className="w-4 h-4 text-primary-500" />
                    <span>Duration: <strong>{course.duration}</strong></span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center space-x-1">
                      <CreditCard className="w-4 h-4 text-emerald-500" />
                      <span>Seats: <strong>{course.seatsAvailable} Left</strong></span>
                    </span>
                    <span className="text-primary-600 dark:text-primary-400 font-extrabold text-base">₹{course.fees.toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  to={`/courses/${course._id}`}
                  className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-center text-sm transition-all flex items-center justify-center space-x-1 shadow-md shadow-primary-500/10"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Courses;
