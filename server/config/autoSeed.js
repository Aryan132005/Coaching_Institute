const bcrypt = require('bcryptjs');

const seedDefaults = async (db) => {
  const { User, Course, Faculty, Announcement, Enquiry, Admission } = db;

  try {
    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const studentPassword = await bcrypt.hash('student123', salt);

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@coaching.com',
      password: adminPassword,
      role: 'admin',
      phone: '9999999999',
    });

    await User.create({
      name: 'John Doe',
      email: 'student@coaching.com',
      password: studentPassword,
      role: 'student',
      phone: '8888888888',
    });

    // 2. Create Faculty
    await Faculty.bulkCreate([
      {
        name: 'Dr. Ramesh Sharma',
        subject: 'Physics',
        qualification: 'Ph.D. in Physics (IIT Delhi)',
        experience: 15,
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80',
        bio: 'Dr. Ramesh has over 15 years of experience coaching students for JEE Advanced and NEET. He specializes in Mechanics and Electromagnetism.',
      },
      {
        name: 'Prof. Sarah Jenkins',
        subject: 'Mathematics',
        qualification: 'M.Sc. in Mathematics (Oxford University)',
        experience: 12,
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80',
        bio: 'Sarah is famous for making Calculus and Coordinate Geometry simple. She is the author of several prep guidebooks.',
      },
      {
        name: 'Dr. Vikram Malhotra',
        subject: 'Chemistry',
        qualification: 'Ph.D. in Organic Chemistry (IISc Bangalore)',
        experience: 10,
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
        bio: 'Vikram focuses on conceptual clarity in Organic and Physical Chemistry, helping students score top ranks in NEET and JEE.',
      },
      {
        name: 'Anjali Desai',
        subject: 'Computer Science',
        qualification: 'B.Tech in CSE (NIT Trichy)',
        experience: 8,
        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80',
        bio: 'Anjali is a former senior engineer who has transitioned to education. She runs the Full Stack Development and DSA programs.',
      }
    ]);

    // 3. Create Courses
    const courses = await Course.bulkCreate([
      {
        title: 'JEE Main & Advanced Crackers Program',
        description: 'Comprehensive 2-year classroom/online coaching program for JEE aspirants. Includes daily lectures, exhaustive study material, and weekly test series aligned with latest pattern.',
        duration: '2 Years',
        fees: 150000,
        category: 'Engineering',
        faculty: 'Dr. Ramesh Sharma, Prof. Sarah Jenkins, Dr. Vikram Malhotra',
        seatsAvailable: 50,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80',
      },
      {
        title: 'NEET Premium Achievers Program',
        description: 'Elite coaching program focusing on Biology, Physics, and Chemistry. Features regular mock tests, performance diagnostics, and dedicated doubt solving sessions.',
        duration: '1 Year',
        fees: 95000,
        category: 'Medical',
        faculty: 'Dr. Ramesh Sharma, Dr. Vikram Malhotra',
        seatsAvailable: 40,
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&q=80',
      },
      {
        title: 'Full Stack Web Development Bootcamp',
        description: 'Job-oriented bootcamp training in HTML, CSS, JavaScript, React, Node.js, and MongoDB. Includes 5+ real-world projects and interview preparation.',
        duration: '6 Months',
        fees: 45000,
        category: 'Technology',
        faculty: 'Anjali Desai',
        seatsAvailable: 30,
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80',
      },
      {
        title: 'UPSC Civil Services Foundation Program',
        description: 'A structural approach to UPSC Civil Services preparation covering Prelims, Mains, and Essay papers, with emphasis on current affairs and answer writing practice.',
        duration: '1 Year',
        fees: 110000,
        category: 'Civil Services',
        faculty: 'Guest Faculty & Officers',
        seatsAvailable: 60,
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&q=80',
      },
      {
        title: 'GATE Computer Science & IT Special',
        description: 'Targeted program for GATE aspirants focusing on Data Structures, Algorithms, Theory of Computation, Compiler Design, and Operating Systems.',
        duration: '1 Year',
        fees: 60000,
        category: 'Engineering',
        faculty: 'Anjali Desai, Prof. Sarah Jenkins',
        seatsAvailable: 25,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80',
      },
      {
        title: 'Data Science & Machine Learning Bootcamp',
        description: 'Learn Python, Pandas, NumPy, Scikit-Learn, TensorFlow, and SQL. Build predictive models, run experiments, and deploy machine learning APIs.',
        duration: '6 Months',
        fees: 55000,
        category: 'Technology',
        faculty: 'Anjali Desai',
        seatsAvailable: 25,
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&q=80',
      }
    ]);

    // 4. Create Announcements
    await Announcement.bulkCreate([
      {
        title: 'Scholarship Admission Test (SAT) 2026',
        description: 'Register for the SAT scheduled on August 10th, 2026. Get up to 100% tuition fee waiver for JEE and NEET programs. Registration closes on August 5th.',
        postedBy: admin._id,
      },
      {
        title: 'New Full Stack Web Dev Batch Commencing',
        description: 'The upcoming batch for Full Stack Web Development starts on August 1st, 2026. Limited seats remain. Register through your student dashboard.',
        postedBy: admin._id,
      },
      {
        title: 'Weekly Mock Test Results Published',
        description: 'Results for JEE Mock Test #12 and NEET Mock Test #8 are now live in the student panel. Review key answers and detailed reports.',
        postedBy: admin._id,
      }
    ]);

    // 5. Create Sample Enquiry & Admission
    await Enquiry.create({
      name: 'Alice Cooper',
      email: 'alice@gmail.com',
      phone: '7777777777',
      message: 'Can I pay the fees for the JEE Cracker program in monthly installments?',
      status: 'pending',
    });

    if (courses.length > 0) {
      await Admission.create({
        studentName: 'John Doe',
        email: 'student@coaching.com',
        phone: '8888888888',
        courseId: courses[0]._id,
        documents: 'Mock High School Certificate.pdf',
        status: 'pending',
      });
    }

    console.log('[AutoSeed] Default records successfully inserted.');
  } catch (error) {
    console.error('[AutoSeed] Error during seeding:', error.message);
  }
};

module.exports = { seedDefaults };
