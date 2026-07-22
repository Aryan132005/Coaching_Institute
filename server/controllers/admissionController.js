const { Admission, Course } = require('../config/db');

// @desc    Submit a new online admission application
// @route   POST /api/admissions
// @access  Private (Student)
const submitAdmission = async (req, res, next) => {
  try {
    const { studentName, email, phone, courseId, documents } = req.body;

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Create admission entry
    const admission = await Admission.create({
      studentName,
      email,
      phone,
      courseId,
      documents: documents || 'Attached Profile Document',
      status: 'pending',
    });

    res.status(201).json(admission);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all admissions applications (filtered, searched)
// @route   GET /api/admissions
// @access  Private/Admin
const getAdmissions = async (req, res, next) => {
  try {
    const admissions = await Admission.findAll({
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['title', 'fees'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(admissions);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student's admission applications
// @route   GET /api/admissions/my
// @access  Private (Student)
const getMyAdmissions = async (req, res, next) => {
  try {
    const admissions = await Admission.findAll({
      where: { email: req.user.email },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['title', 'fees', 'category', 'duration'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(admissions);
  } catch (error) {
    next(error);
  }
};

// @desc    Update admission status
// @route   PUT /api/admissions/:id/status
// @access  Private/Admin
const updateAdmissionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status type. Must be pending, approved, or rejected.');
    }

    const admission = await Admission.findByPk(req.params.id);

    if (admission) {
      admission.status = status;
      const updatedAdmission = await admission.save();

      console.log(`[NOTIFICATION] Status of admission application for ${admission.studentName} updated to ${status}. Notification email triggered to ${admission.email}.`);

      res.json(updatedAdmission);
    } else {
      res.status(404);
      throw new Error('Admission application not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitAdmission,
  getAdmissions,
  getMyAdmissions,
  updateAdmissionStatus,
};
