import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Loader from '../components/Loader';
import { Award, BookOpen, Users, HelpCircle, ArrowRight, Star, Quote } from 'lucide-react';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get('/courses');
        setCourses(res.data.slice(0, 3)); // show top 3 featured courses
      } catch (err) {
        console.error('Error fetching featured courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const stats = [
    { icon: <Users className="w-8 h-8 text-primary-500" />, count: '10K+', label: 'Students Trained' },
    { icon: <Award className="w-8 h-8 text-accent-500" />, count: '98%', label: 'Success Rate' },
    { icon: <BookOpen className="w-8 h-8 text-emerald-500" />, count: '25+', label: 'Expert Courses' },
    { icon: <HelpCircle className="w-8 h-8 text-purple-500" />, count: '24/7', label: 'Doubt Support' },
  ];

  const testimonials = [
    {
      name: 'Rohan Mehta',
      course: 'JEE Advanced Program',
      comment: 'The mock test series and regular feedback sessions at Apex Academy helped me clear IIT JEE with an All India Rank of 452. The teachers are extremely approachable!',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      course: 'NEET Achievers Program',
      comment: 'Apex Academy provides the best biology lectures. The concepts were explained with 3D models and diagram walk-throughs which made learning so much easier.',
      rating: 5,
    },
    {
      name: 'Aravind Nair',
      course: 'Full Stack Web Dev',
      comment: 'I transitioned from a non-tech background to a Software Engineer. The Web Dev bootcamp is very practical and project-driven. The career advice was invaluable.',
      rating: 5,
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-24 md:py-32">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-slate-950 to-primary-900 z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/10 blur-[120px] rounded-full z-0"></div>
        <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-accent-500/5 blur-[80px] rounded-full z-0"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-900/60 border border-primary-500/30 text-primary-300">
              ⚡ Admissions Open for 2026 Batch
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Unlock Your Potential, <br />
              <span className="text-primary-400">Secure Your Future</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-lg mx-auto lg:mx-0">
              Prepare for JEE, NEET, UPSC, and Modern Technology bootcamps with industry-expert mentors and structured mock assessments.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/courses"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-center shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center space-x-2"
              >
                <span>Explore Programs</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-center border border-slate-700 transition-all"
              >
                Apply Online
              </Link>
            </div>
          </div>

          {/* Graphic Element */}
          <div className="relative flex justify-center">
            <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl relative border-4 border-slate-800/80">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"
                alt="Students studying"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-left">
                <p className="text-accent-400 font-bold text-sm">Join 10,000+ Alumni</p>
                <h3 className="text-white font-extrabold text-lg">98% Academic Success Rate</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institute Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Why Choose Apex Academy?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            We provide a comprehensive ecosystem for student learning, including expert faculty, individual focus, and deep performance analytics.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mx-auto w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{stat.count}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              Featured Programs
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Handpicked courses built specifically to accelerate your career or academic target.
            </p>
          </div>
          <Link
            to="/courses"
            className="mt-4 md:mt-0 px-5 py-2.5 rounded-xl border border-primary-200 dark:border-slate-800 text-primary-600 dark:text-primary-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course) => (
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
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between text-sm">
                    <span className="text-slate-400">Duration: <strong className="text-slate-700 dark:text-slate-200">{course.duration}</strong></span>
                    <span className="text-primary-600 dark:text-primary-400 font-extrabold text-base">₹{course.fees.toLocaleString()}</span>
                  </div>
                  <Link
                    to={`/courses/${course._id}`}
                    className="w-full py-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/30 hover:bg-primary-600 hover:text-white text-primary-600 dark:text-primary-400 font-bold text-center text-sm transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="bg-slate-100 dark:bg-slate-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Student Success Stories
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Listen to students who cracked premier entrance exams and landed their dream roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col relative"
              >
                <Quote className="w-10 h-10 text-primary-100 dark:text-slate-850 absolute top-4 right-4" />
                <div className="flex space-x-1 mb-4 z-10">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-accent-500 text-accent-500" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 italic z-10">
                  "{t.comment}"
                </p>
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</h4>
                  <p className="text-primary-500 font-semibold text-xs mt-0.5">{t.course}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
