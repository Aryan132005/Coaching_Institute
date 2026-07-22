import React from 'react';
import { Target, Compass, Award, Calendar, BookOpen, UserCheck } from 'lucide-react';

const About = () => {
  const achievements = [
    { year: '2023', title: 'Best Coaching Center Award', desc: 'Conferred by Delhi Educational Forum for JEE prep results.' },
    { year: '2024', title: '500+ Selections in Premier Exams', desc: 'Over 500 students cracked IIT-JEE, NEET and Civil Services.' },
    { year: '2025', title: 'Smart Classroom Initiative', desc: 'Equipped all classrooms with interactive whiteboards and AI diagnostics.' }
  ];

  const coreValues = [
    { icon: <Target className="w-6 h-6 text-primary-500" />, title: 'Mission', desc: 'To offer affordable, highly structured, concept-driven coaching to prepare students for competitive and professional excellence.' },
    { icon: <Compass className="w-6 h-6 text-accent-500" />, title: 'Vision', desc: 'To become a globally recognized educational institute that fosters critical thinking, problem-solving skills, and academic integrity.' },
    { icon: <Award className="w-6 h-6 text-emerald-500" />, title: 'Ethics', desc: 'We believe in transparency, honesty, and consistent efforts. We guide students individually rather than utilizing mass-market formulas.' }
  ];

  const galleryImages = [
    { url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=80', title: 'Main Campus' },
    { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80', title: 'Graduation Ceremony' },
    { url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80', title: 'Digital Classrooms' },
    { url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&q=80', title: 'Study Labs' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* Intro Banner */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
          Established 2018
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
          Fostering Brilliance <span className="text-primary-600 dark:text-primary-400">Through Education</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
          Apex Academy was founded with a singular vision: to dismantle the hurdles of rote learning and substitute it with conceptual pedagogy. Over the years, we have grown from a small tutorial room to a leading prep academy.
        </p>
      </section>

      {/* Mission / Vision Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {coreValues.map((value, i) => (
          <div
            key={i}
            className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-center">
              {value.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{value.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{value.desc}</p>
          </div>
        ))}
      </section>

      {/* Milestones / Achievements */}
      <section className="bg-slate-100 dark:bg-slate-900/50 p-8 md:p-12 rounded-3xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Our Journey & Achievements
          </h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
            We measure our progress through the success of our students. Over the years, we have achieved notable landmarks, setting high standards for competitive exam prep.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300 text-sm">
              <Calendar className="w-5 h-5 text-primary-500" />
              <span>Year-round micro-scheduled target planners.</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300 text-sm">
              <BookOpen className="w-5 h-5 text-primary-500" />
              <span>Regular guest lectures by senior civil servants and engineers.</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300 text-sm">
              <UserCheck className="w-5 h-5 text-primary-500" />
              <span>Rigorous personal mentoring sessions weekly.</span>
            </div>
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="space-y-6">
          {achievements.map((item, index) => (
            <div key={index} className="flex space-x-4">
              <div className="font-extrabold text-primary-600 dark:text-primary-400 text-lg mt-0.5 shrink-0">
                [{item.year}]
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-950 dark:text-white text-sm">{item.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Campus Highlights</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Take a visual tour around our modern digital classrooms, reading halls, and campus.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {galleryImages.map((img, i) => (
            <div key={i} className="group relative rounded-2xl overflow-hidden h-48 bg-slate-100 shadow-sm">
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-center p-4">
                <span className="text-white text-sm font-bold">{img.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;
