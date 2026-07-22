import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Loader from '../components/Loader';
import { Award, Briefcase, GraduationCap } from 'lucide-react';

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await API.get('/faculty');
        setFaculty(res.data);
      } catch (err) {
        console.error('Error fetching faculty profiles', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Our Faculty Members</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Learn from premier academicians, former software engineers, and subject matter experts.
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {faculty.map((member) => (
            <div
              key={member._id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              {/* Photo */}
              <div className="h-56 relative bg-slate-100">
                <img
                  src={member.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80'}
                  alt={member.name}
                  className="w-full h-full object-cover object-top"
                />
                <span className="absolute bottom-4 left-4 px-2.5 py-1 text-xs font-bold rounded-lg bg-primary-600 text-white shadow-md">
                  {member.subject}
                </span>
              </div>

              {/* Text */}
              <div className="p-6 space-y-4 flex flex-col flex-grow">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {member.name}
                  </h3>
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                    <GraduationCap className="w-4 h-4 mr-1 text-primary-500 shrink-0" />
                    <span>{member.qualification}</span>
                  </div>
                </div>

                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-4 flex-grow italic">
                  "{member.bio || 'Dedicated to shaping student futures through clear and structured teaching methodologies.'}"
                </p>

                {/* Meta details */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Briefcase className="w-3.5 h-3.5 text-primary-500" />
                    <span>Experience: <strong>{member.experience} Yrs</strong></span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5 text-accent-500" />
                    <span>Senior Mentor</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Faculty;
